---
title: 'Playing with Windows Terminal (Preview)'
date: 2019-08-15
category: Programming
tags:
  - terminal
  - msys
  - win10
---

I recently spent some time playing with the new [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal-preview/9n0dx20hk701?activetab=pivot:overviewtab). It's currently a preview app on the Microsoft Store for Windows 10 version >=18362.0. In short, I think it's pretty awesome.<!-- more --> People are already doing fun things with it, like [build system reaction gifs](https://www.hanselman.com/blog/AddingReactionGifsForYourBuildSystemAndTheWindowsTerminal.aspx). Here's how mine is currently set up.

{% include image.html src='posts/2019/playing-with-windows-terminal-preview/coffee-terminal.png'
                      class='center no-border'
                      alt='Coffee Terminal with Campbell Scheme' %}

All configuration is currently done in the settings file, `profiles.json`, which is accessible via `ctrl+,` or through the dropdown in the titlebar. I'm just using the standard Campbell scheme with a background image, which can be added to a profile with the following.

```json
"backgroundImage" : "c:/Users/tad/Pictures/Wallpapers/Terminal/coffee.jpg",
"backgroundImageOpacity" : 0.4,
"backgroundImageAlignment": "bottomRight",
"backgroundImageStretchMode" : "uniformToFill"
```

I also like the [Dracula](https://draculatheme.com/) scheme that can be found [here](https://github.com/dracula/windows-terminal).

{% include image.html src='posts/2019/playing-with-windows-terminal-preview/coffee-dracula-terminal.png'
                      class='center no-border'
                      alt='Coffee Terminal with Dracula Scheme' %}

I may end up switching to the Dracula scheme alone. I really like my coffee image, but Dracula sans coffee might be a bit more tasteful.

{% include image.html src='posts/2019/playing-with-windows-terminal-preview/dracula-terminal.png'
                      class='center no-border'
                      alt='Dracula Terminal Scheme' %}

I'll probably give [WSL](https://docs.microsoft.com/en-us/windows/wsl/about){:title="Windows Subsystem for Linux"} a try sometime soon, but I've been using and thoroughly enjoying [MSYS2](https://www.msys2.org/) for a while now. Adding MSYS2 to the Windows Terminal can be done by specifying the profile's `"commandline"`.

```json
"commandline" : "c:/msys64/usr/bin/bash.exe --login -i"
```

Note that, at least for me, including `--login` breaks the `"startingDirectory"` specification (similar things happen to me when using MSYS2 in [Visual Studio Code's](https://code.visualstudio.com/) built-in terminal), but I don't really feel like going through the effort to figure out why. Here's the full profile for my current setup:

```json
{
    "acrylicOpacity" : 1.0,
    "backgroundImage" : "c:/Users/tad/Pictures/Wallpapers/Terminal/coffee.jpg",
    "backgroundImageOpacity" : 0.4,
    "backgroundImageAlignment": "bottomRight",
    "backgroundImageStretchMode" : "uniformToFill",
    "closeOnExit" : true,
    "colorScheme" : "Campbell",
    "commandline" : "c:/msys64/usr/bin/bash.exe --login -i",
    "cursorColor" : "#FFFFFF",
    "cursorShape" : "bar",
    "fontFace" : "Consolas",
    "fontSize" : 12,
    "guid" : "{0caa0dad-35be-5f56-a8ff-afceeeaa6110}",
    "historySize" : 9001,
    "icon" : "C:\\msys64\\msys2.ico",
    "name" : "MSYS2",
    "padding" : "0, 0, 0, 0",
    "snapOnInput" : true,
    "useAcrylic" : false
}
```

This is the second Microsoft-developed terminal I'm using now, the other being Visual Studio Code's built-in terminal (the [Shell launcher extension](https://marketplace.visualstudio.com/items?itemName=Tyriar.shell-launcher) is a must have for the latter), and I'm excited to see the awesome profiles and schemes that users create when it gains more popularity.
