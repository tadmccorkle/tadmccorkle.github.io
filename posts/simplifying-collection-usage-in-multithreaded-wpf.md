---
title: 'Simplifying Collection Usage in Multithreaded WPF'
date: 2025-05-12
excerpt: A convenient way to avoid issues with observable collections in multithreaded WPF applications.
---

Data binding in WPF makes updating the UI in response to changes easy, so long as the UI is notified of changes by way of the `INotifyPropertyChanged` or `INotifyCollectionChanged` interface change events. For scalar properties, this is true even when an update is triggered from a background thread &mdash; the binding engine handles the property change by marshalling it (i.e., queuing a corresponding delegate) to the appropriate UI thread's dispatcher. While there's no manual marshalling or synchronization required by the application developer for scalar property updates, you'll quickly discover that this is <strong>not</strong> the case when binding an `ItemControl`'s `ItemsSource` to a dynamic collection. In fact, manual marshalling to the UI thread or additional synchronization is absolutely required in a multithreaded context.

:::aside
**tl;dr** I've been using [a simple solution](#my-preferred-solution) to the issue of multithreaded collection modification in WPF that avoids many of the tradeoffs in approaches I've seen referenced. You can see it in action [here](https://github.com/tadmccorkle/CsmLib).
:::

# Why are collections treated differently?

Without getting too deep in the weeds, this is due to how WPF handles collection bindings. WPF uses a type called `CollectionView` to access a bound collection. Any given `CollectionView` has affinity to the thread that created its corresponding `ItemsControl`, meaning it requires its operations to occur on that thread. By default, if a `CollectionView` operation is initiated from a background thread &mdash; for example, by adding to a UI-bound `ObservableCollection<T>` &mdash; the `CollectionView` will throw an exception.

Notice I said this `CollectionView` behavior is "by default." WPF does provide a mechanism to allow collection changes on background threads through `BindingOperations.EnableCollectionSynchronization`; however, this isn't free and requires that the developer makes other guarantees that I'll cover later.

# Some common approaches

So, if we decide to marshal collection change events ourselves, how should we do that? One approach is to invoke on the current application's dispatcher directly.

```csharp
public class ViewModel
{
    public ObservableCollection<string> Messages { get; } = [];

    public void AddMessage(string message)
    {
        if (Application.Current is null || Application.Current.Dispatcher.CheckAccess())
        {
            this.Messages.Add(message);
        }
        else
        {
            _ = Application.Current.Dispatcher.InvokeAsync(
                () => this.Messages.Add(message));
        }
    }
}
```

While this is straightforward, it comes with some downsides:

- The view model is now dependent on `System.Windows`.
- This view model, along with anything else that follows this pattern, will not work for multithreaded UI applications &mdash; windows with their own UI thread would have their own `Dispatcher`.
- Similar marshalling needs to occur anywhere `Messages` is modified.

We can get around the first two issues if we're willing to make a tradeoff. The dependency on `System.Windows` and the current application's dispatcher can be removed if we capture and use the target UI thread's [`SynchronizationContext`](https://learn.microsoft.com/en-us/dotnet/api/system.threading.synchronizationcontext).

:::aside
**How can we use a `SynchronizationContext` in place of a `Dispatcher`?** In WPF applications, posting or sending delegates with a UI thread's `SynchronizationContext.Current` queues them to the corresponding thread's `Dispatcher.Current` with default priority. If we don't need to tune our implementation for UI responsiveness, then using a `SynchronizationContext` allows our implementation to be more general (i.e., not tied to `System.Windows`) and simpler. If we need to have more control, we could use a `Dispatcher` directly instead.
:::

Capturing a `SynchronizationContext` can either be done:

- Upon creating the view model, which requires that we guarantee the view model is created on the target UI thread.
- Elsewhere in our application, again on the target UI thread, with our view model requiring we it provide the captured reference.

Our view model could look something like this:

```csharp
public class ViewModel
{
    private readonly SynchronizationContext sc;

    // NOTE:
    // We *must* be on the UI thread at this point, otherwise we'll
    // dispatch operations to a non-UI thread! Being on the UI thread
    // also allows us to assume the SynchronizationContext exists,
    // which is not guaranteed for any arbitrary thread.
    public ViewModel() : this(SynchronizationContext.Current!) { }

    public ViewModel(SynchronizationContext sc)
    {
        this.sc = sc;
    }

    public ObservableCollection<string> Messages { get; } = [];

    public void AddMessage(string message)
    {
        if (this.sc == SynchronizationContext.Current)
        {
            this.Messages.Add(message);
        }
        else
        {
            this.sc.Post(this.AddMessageCallback!, message);
        }
    }

    private void AddMessageCallback(object message)
    {
        this.Messages.Add((string)message);
    }
}
```

The biggest tradeoff with these approaches is something I've explicitly called out multiple times: we have to be on the target UI thread when capturing the `SynchronizationContext` or `Dispatcher`. If we're willing to accept that tradeoff (spoiler: [we don't necessarily have to](#my-preferred-solution)), we can get around the third issue I mentioned above as well &mdash; namely, needing similar marshalling anywhere `Messages` is used &mdash; by creating a subclass of `ObservableCollection<T>` that marshals change events for us.

```csharp
public class SynchronizedObservableCollection<T> : ObservableCollection<T>
{
    private readonly SynchronizationContext sc;

    public SynchronizedObservableCollection()
        : this(SynchronizationContext.Current!) { }

    public SynchronizedObservableCollection(SynchronizationContext sc)
    {
        this.sc = sc;
    }

    // ...
    // other ObservableCollection<T> constructors
    // and SynchronizationContext overloads
    // ...

    protected override void OnCollectionChanged(NotifyCollectionChangedEventArgs e)
    {
        if (this.sc == SynchronizationContext.Current)
        {
            base.OnCollectionChanged(e);
        }
        else
        {
            this.sc.Send(OnCollectionChangedCallback!, e);
        }
    }

    private void OnCollectionChangedCallback(object e)
    {
        base.OnCollectionChanged((NotifyCollectionChangedEventArgs)e);
    }

    protected override void OnPropertyChanged(PropertyChangedEventArgs e)
    {
        if (this.sc == SynchronizationContext.Current)
        {
            base.OnPropertyChanged(e);
        }
        else
        {
            this.sc.Send(OnPropertyChangedCallback!, e);
        }
    }

    private void OnPropertyChangedCallback(object e)
    {
        base.OnPropertyChanged((PropertyChangedEventArgs)e);
    }
}
```

With this new collection, our view model becomes:

```csharp
public class ViewModel
{
    // NOTE:
    // Like before, we *must* be on the UI thread at this point.
    public SynchronizedObservableCollection<string> Messages { get; } = [];

    public void AddMessage(string message)
    {
        this.Messages.Add(message);
    }
}
```

There is a subtle, but very important, difference between the new subclass and the previous implementation. Because the entire `Add` operation, including both adding the item and raising change events, on the `Messages` collection was previously marshalled to the UI thread, `AddMessage` was effectively thread-safe. Now, `AddMessage` can still be called from a background thread, but it is not thread-safe &mdash; multiple threads calling it at approximately the same time could result in an exception due to collection modifications before the UI can finish processing a previous change event. This is also why the subclass calls the `SynchronizationContext`'s synchronous `Send` method instead of `Post`. We have to ensure the UI can finish processing change events before modifying the collection again.

At this point, we could consider ways to make our new collection thread-safe for modifications. For example, we could override every `ObservableCollection<T>` modification method and queue operations on the UI thread. We could also change our approach and stop marshalling collection changes ourselves.

:::aside
Another solution that I'm not going to discuss in detail is akin to what I cover below. In short, we could maintain two copies of the collection, a thread-safe collection that queues changes to another UI-bound collection, which processes queued changes on the UI thread. This is better explained and demonstrated [here](https://www.meziantou.net/thread-safe-observable-collection-in-dotnet.htm).

**Bonus:** The collection in the linked post uses an `ImmutableList<T>` behind the scenes, so it can be safely enumerated without additional synchronization.
:::

WPF provides a mechanism that allows collection changes to occur on background threads provided the developer makes some guarantees: [`BindingOperations.EnableCollectionSynchronization`](https://learn.microsoft.com/en-us/dotnet/api/system.windows.data.bindingoperations.enablecollectionsynchronization). When this is called on a UI-bound collection, WPF effectively queues up change events and processes changes on the UI thread. The required guarantees are:

- The method must be called on the target UI thread.
- Modifications and access to the collection must be synchronized to ensure the collection is not modified while the UI thread is accessing it.

Synchronization can be as simple as acquiring a lock, although the API allows for more sophisticated synchronization. Using this method our view model can go back to using the standard `ObservableCollection<T>`.

```csharp
public class ViewModel
{
    private readonly object messageLock = new();

    public ViewModel()
    {
        // NOTE:
        // We still *must* be on the UI thread!
        BindingOperations.EnableCollectionSynchronization(
            this.Messages, this.messageLock);
    }

    public ObservableCollection<string> Messages { get; } = [];

    public void AddMessage(string message)
    {
        lock (this.messageLock)
        {
            this.Messages.Add(message);
        }
    }
}
```

This has similar downsides the other implementations covered so far:

- The view model is now dependent on `System.Windows.Data`.
- The view model must be created on the target UI thread.
- Similar synchronization needs to occur anywhere `Messages` is modified.

With a few changes, though, we can mitigate all of these downsides.

# My preferred solution

We've already shown a subclass can be used to avoid explicit call-site synchronization when modifying an `ObservableCollection<T>`.

```csharp
public interface ISynchronized
{
    object SynchronizationLock { get; }
}

public class SynchronizedObservableCollection<T> 
    : ObservableCollection<T>, ISynchronized
{
    private readonly object syncLock;

    public SynchronizedObservableCollection()
        : this(new object()) { }

    public SynchronizedObservableCollection(object syncLock)
    {
        this.syncLock = syncLock;
    }

    // ...
    // other ObservableCollection<T> constructors
    // and syncLock overloads
    // ...

    object ISynchronized.SynchronizationLock => this.syncLock;

    protected override void InsertItem(int index, T item)
    {
        lock (this.syncLock)
        {
            base.InsertItem(index, item);
        }
    }

    // ...
    // other synchronized modification overloads
    // ...

    /// <inheritdoc cref="Collection{T}.Add(T)"/>
    public void UnsyncAdd(T item)
    {
        base.InsertItem(this.Count, item);
    }

    // ...
    // other modification escape hatch methods that leave
    // synchronization up to the caller
    // ...
}
```

Notice that this collection subclass implements a new `ISynchronized` interface. Our view model no longer needs to synchronize modifications explicitly.

```csharp
public class ViewModel
{
    public ViewModel()
    {
        // NOTE:
        // We still *must* be on the UI thread!
        BindingOperations.EnableCollectionSynchronization(
            this.Messages,
            ((ISynchronized)this.Messages).SynchronizationLock);
    }

    public SynchronizedObservableCollection<string> Messages { get; } = [];

    public void AddMessage(string message)
    {
        this.Messages.Add(message);
    }
}
```

We still have the problem of our view model needing to be created on the target UI thread. There is a way to allow our view model to be created on any thread and still leverage WPF's built-in collection synchronization: an [attached property](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/properties/attached-properties-overview). Attached properties are always evaluated on the UI thread, so we can use them to defer collection synchronization until the UI first binds to our collection.

```csharp
public static class Synchronized
{
    public static readonly DependencyProperty ItemsSourceProperty =
        DependencyProperty.RegisterAttached(
            "ItemsSource",
            typeof(IEnumerable),
            typeof(Synchronized),
            new PropertyMetadata(null, OnItemsSourceChanged));

    [AttachedPropertyBrowsableForType(typeof(ItemsControl))]
    public static IEnumerable GetItemsSource(DependencyObject target)
        => (IEnumerable)target.GetValue(ItemsSourceProperty);

    public static void SetItemsSource(DependencyObject target, IEnumerable value)
        => target.SetValue(ItemsSourceProperty, value);

    private static void OnItemsSourceChanged(
        DependencyObject d,
        DependencyPropertyChangedEventArgs e)
    {
        var ic = (ItemsControl)d;

        if (e.NewValue is null)
        {
            ic.ItemsSource = null;
            return;
        }

        var newItemsSource = (IEnumerable)e.NewValue;

        IEnumerable synchronizedItemsSource = newItemsSource is ICollectionView cv
            ? cv.SourceCollection : newItemsSource;

        var synchronized = synchronizedItemsSource as ISynchronized
            ?? throw new ArgumentException(
                $"Cannot synchronize access to items in source collection of type " +
                $"'{synchronizedItemsSource.GetType()}' because it does not implement " +
                $"'{nameof(ISynchronized)}'.");

        BindingOperations.EnableCollectionSynchronization(
            synchronizedItemsSource,
            synchronized.SynchronizationLock);

        ic.ItemsSource = newItemsSource;
    }
}
```

Putting everything together, our view model becomes:

```csharp
public class ViewModel
{
    public SynchronizedObservableCollection<string> Messages { get; } = [];

    public void AddMessage(string message)
    {
        this.Messages.Add(message);
    }
}
```

While our UI's XAML starts using the attached property instead of `ItemsSource` properties directly:

```xml
<Window x:Class="Examples.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:Examples"
        xmlns:csm="clr-namespace:CsmLib.Wpf.Controls;assembly=CsmLib.Wpf"
        mc:Ignorable="d"
        d:DataContext="{d:DesignInstance local:ViewModel}"
        Title="Example" Height="450" Width="800">

    <!-- before: <ListBox ItemsSource="{Binding Messages}"/>-->
    <ListBox csm:Synchronized.ItemsSource="{Binding Messages}"/>

</Window>
```

Now our observable collection is thread-safe for modifications, and we don't have to consider the UI thread outside of data binding.

You can find full source code and an accompanying example [here](https://github.com/tadmccorkle/CsmLib).
