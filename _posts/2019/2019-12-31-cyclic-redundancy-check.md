---
title: 'Cyclic Redundancy Check'
date: 2019-12-31
last_updated: 2020-02-15
category: Math
tags:
  - error-detection
  - algorithm
  - hash-function
_excerpt: <p></p>
katex: true
---

I was introduced to the [cyclic redundancy check](https://en.wikipedia.org/wiki/Cyclic_redundancy_check){:title="Wikipedia.com - 'Cyclic redundancy check'"} (CRC) at work a few months ago. I soon found out they're used in a variety of areas, which sparked my interest. I ended up reading a good bit about them, so I thought I'd document some of what I've learned here.<!-- more --> This post will be long, but it doesn't attempt to cover all topics associated with CRCs. I don't have the level of knowledge required to do that, and, even if I did, there are far too many concepts to do so in a reasonable amount of time. I only intend to provide a basic intro to the concepts around CRCs.

- [What is a CRC?](#what-is-a-crc)
- [The math behind a CRC](#the-math-behind-a-crc)
  - [Finite fields](#finite-fields)
  - [Representing binary data as a polynomial](#representing-binary-data-as-a-polynomial)
  - [Polynomial division of binary data](#polynomial-division-of-binary-data)
  - [Doesn't this seem a little overly complex?](#doesnt-this-seem-a-little-overly-complex)
  - [Selecting generator polynomials](#selecting-generator-polynomials)
    - [Polynomial degree](#polynomial-degree)
    - [Hamming distance](#hamming-distance)
    - [Burst error detection](#burst-error-detection)
    - [A final note on selection](#a-final-note-on-selection)
- [Naming conventions and polynomial representations](#naming-conventions-and-polynomial-representations)
- [Implementing CRCs](#implementing-crcs)
  - [Simple Python implementation](#simple-python-implementation)
  - [Shift register in software](#shift-register-in-software)
  - [Table lookup](#table-lookup)
- [Wrapping up](#wrapping-up)
- [Primary references](#primary-references)

## What is a CRC?

A CRC is a fixed length code frequently used for [error detection](https://en.wikipedia.org/wiki/Error_detection_and_correction){:title="Wikipedia.com - 'Error detection and correction'"} when transmitting binary data. It's even used in the [Ethernet standard](https://en.wikipedia.org/wiki/IEEE_802.3){:title="Wikipedia.com - 'IEEE 802.3'"}. Their name pretty accurately describes them:

- Cyclic - the value is obtained by cycling through the data in a message
- Redundancy - the value is added to the message being sent without any additional information
- Check - the value is used to verify its associated data

Like the [parity bit](https://en.wikipedia.org/wiki/Parity_bit){:title="Wikipedia.com - 'Parity bit'"} and simple [checksums](https://en.wikipedia.org/wiki/Checksum){:title="Wikipedia.com - 'Checksum'"}, CRCs have the benefit of being [simple and easy to implement with hardware](https://www.youtube.com/watch?v=sNkERQlK8j8){:title="YouTube.com - 'Hardware build: CRC calculation by Ben Eater'"}, but they offer much more error-detection capability. CRCs, depending on certain known parameters, guarantee specific [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance){:title="Wikipedia.com - 'Hamming distance'"} properties. They're also very good for detecting [burst errors](https://en.wikipedia.org/wiki/Burst_error){:title="Wikipedia.com - 'Burst error'"}, which are common with data transmission systems. The two most important values associated with a CRC are the data being sent and a value referred to as the CRC's generator polynomial, both of which are binary numbers. "Polynomial" is used because CRC algorithms essentially just calculate the remainder of polynomial division.

## The math behind a CRC

A CRC value can be obtained by dividing useful binary data (what we want to transmit) by a fixed binary value. The remainder of the division is the CRC. This is an oversimplification of what really occurs though. Calculating the remainder of the division of two numbers is an expensive operation, particularly when working with minimal hardware systems. To be both fast and usable in simple systems (that is, to rely on simple, logical operations like bit shifting and exclusive or), CRCs cleverly take advantage of two simple mathematical properties:

- the Galois field, or finite field, GF(2)
- polynomial division

### Finite fields

A [finite field](https://en.wikipedia.org/wiki/Finite_field){:title="Wikipedia.com - 'Finite field'"} is a bound set of numbers that obeys particular axioms of arithmetic (multiplication, addition, subtraction, and division), including the associative property, commutative property, distributive property, additive identity, multiplicative identity, additive inverses, and multiplicative inverses. [GF(2)](https://en.wikipedia.org/wiki/GF(2)){:title="Wikipedia.com - 'GF(2)'"} is the smallest finite field, comprised of only `0` and `1`, whose addition and multiplication operations are defined as:

{% include table.html table='
| \\(A\\) | \\(B\\) | \\(A+B\\) | \\(A\times{B}\\) |
| :-----: | :-----: | :-------: | :--------------: |
|    0    |    0    |     0     |        0         |
|    0    |    1    |     1     |        0         |
|    1    |    0    |     1     |        0         |
|    1    |    1    |     0     |        1         |
' %}

The table above can be used to demonstrate all axioms previously mentioned, such as GF(2)'s additive identity, `0`, and its multiplicative identity, `1` (this is true because `x+0` results in `x` for all possible `x` and `x*1` results in `x` for all possible `x`). It also shows that addition in GF(2) equates to exclusive or (XOR) and multiplication in GF(2) equates to logical conjunction (AND). The most important implications of the properties of GF(2) to make note of when dealing with CRCs are:

{% include equation.html equations='
x + x = 0 \implies x = -x\?/x * 1 = x \implies x = {x\over{1}}
' %}

The first implication shows that addition is equivalent to subtraction for GF(2), which is contrary to addition and subtraction for real numbers. The second implication shows that division is the inverse of multiplication for GF(2), just as it is for real numbers.

### Representing binary data as a polynomial

Earlier, I noted that CRCs make use of polynomial division, but CRCs are operations we use when transmitting binary data. This is possible because CRCs treat the data they're working with as polynomials behind the scenes. It might sound strange to do this, but we (sort of) already do this when converting binary values to their decimal equivalents. Binary data, `10010100` as an example, can be converted to its decimal equivalent as a summation of powers of 2:

{% include equation.html equations='
\underline{10010100}_2 = \underline{\textbf{1}}\times2^7 + \underline{\textbf{0}}\times2^6 + \underline{\textbf{0}}\times2^5 + \underline{\textbf{1}}\times2^4 + \underline{\textbf{0}}\times2^3 + \underline{\textbf{1}}\times2^2 + \underline{\textbf{0}}\times2^1 + \underline{\textbf{0}}\times2^0 = 148_{10}
' %}

Instead of powers of 2, CRCs represent binary data as powers of x; that is, as a polynomial:

{% include equation.html equations='10010100_2 = x^7 + x^4 + x^2' %}

### Polynomial division of binary data

Using the polynomial representation of binary data, [polynomial division](https://en.wikipedia.org/wiki/Polynomial_long_division){:title="Wikipedia.com - 'Polynomial long division'"} can be performed. Keep in mind that this polynomial division obeys the rules of GF(2), so addition is equivalent to subtraction and the only possible coefficients possible are 0 and 1. Here is how `10010100` is "divided by" `101`:

{% include equation.html equations='
\begin{array}{r}
1x^5\phantom{+0x^6}+1x^3+1x^2+1x\phantom{+0x^2+0x^1+0} \\
1x^2+0x+1{\overline{\smash{\big)}\,1x^7+0x^6+0x^5+1x^4+0x^3+1x^2+0x+0}} \\
+\underline{1x^7+0x^6+1x^5}\phantom{+0x^4+0x^3+0x^2+0x+0} \\
1x^5+1x^4+0x^3+1x^2+0x+0 \\
+\underline{1x^5+0x^4+1x^3}\phantom{+0x^2+0x+0} \\
1x^4+1x^3+1x^2+0x+0 \\
+\underline{1x^4+0x^3+1x^2}\phantom{+0x+0} \\
1x^3+0x^2+0x+0 \\
+\underline{1x^3+0x^2+1x}\phantom{+0} \\
1x+0 \\
\end{array}
' %}

The operation above shows that division of the binary number `10010100` by `101` results in `101110` (the binary form of the polynomial \\(x^5+x^3+x^2+x\\)) with a remainder of `10` (the binary form of the polynomial \\(x\\)). It's important to note that, as with normal division, subtracting the remainder, `10`, from the original dividend, `10010100`, and performing the division operation again yields a result with no remainder:

{% include equation.html equations='
\begin{array}{cl}
10010100_2 - 10_2 = 10010100_2 + 10_2 = 10010110_2 \\
\\
10010110_2 = x^7 + x^4 + x^2 + x \\
\\
10010110_2\div101_2 \\
\\
\downarrow \\
\\
\begin{array}{r}
1x^5\phantom{+0x^6}+1x^3+1x^2+1x\phantom{+0x^2+0x^1+0} \\
1x^2+0x+1{\overline{\smash{\big)}\,1x^7+0x^6+0x^5+1x^4+0x^3+1x^2+1x+0}} \\
+\underline{1x^7+0x^6+1x^5}\phantom{+0x^4+0x^3+0x^2+0x+0} \\
1x^5+1x^4+0x^3+1x^2+1x+0 \\
+\underline{1x^5+0x^4+1x^3}\phantom{+0x^2+0x+0} \\
1x^4+1x^3+1x^2+1x+0 \\
+\underline{1x^4+0x^3+1x^2}\phantom{+0x+0} \\
1x^3+0x^2+1x+0 \\
+\underline{1x^3+0x^2+1x}\phantom{+0} \\
0x+0 \\
\end{array}
\end{array}
' %}

This is essentially the process of verifying data with a CRC! More specifically, the process demonstrated above is a type of 2-bit CRC, or CRC-2, which means that the check value is 2 bits in length. How? Assume the "useful" data we need to send is `100101`. CRCs are typically calculated in systematic form, which means the useful data is embedded in the encoded data. To achieve systematic form without modifying the useful data, placeholder bits must be added. To apply a CRC-2 to `100101`, two placeholder bits need to be added, which gives `10010100`. This new value must then be divided by a generator polynomial, which is `101` in the example above. The remainder of the division, `10`, is the CRC value. By substituting the placeholder bits in the data to be sent with the CRC value, which results in `10010110`, we are effectively <em>subtracting</em> (remember GF(2)) the remainder of the division operation from the dividend. This is the value we transmit. The receiver, who also knows the generator polynomial, can perform the same polynomial division on the data it receives. If the division operation yields no remainder, the receiver can assume the data was transmitted successfully (no errors were introduced during transmission). The receiver could also perform the division operation just as the transmitter, using placeholder bits in place of the CRC value, and compare the resulting remainder with the transmitted CRC value.

### Doesn't this seem a little overly complex?

At the beginning of the post I mentioned that CRCs had the benefit of being simple and easy to implement with hardware, but performing polynomial division in hardware, at least to me, doesn't sound like a "simple and easy" task. Luckily, there's another clever technique we can use to simplify the CRC calculation.

CRCs don't care about the quotient obtained through polynomial division; they only need to determine the remainder. With that in mind, let's look at the operation without keeping track of the quotient:

{% include equation.html equations='
\begin{array}{r}
1x^2+0x+1{\overline{\smash{\big)}\,1x^7+0x^6+0x^5+1x^4+0x^3+1x^2+0x+0}} \\
+\underline{1x^7+0x^6+1x^5}\phantom{+0x^4+0x^3+0x^2+0x+0} \\
1x^5+1x^4+0x^3+1x^2+0x+0 \\
+\underline{1x^5+0x^4+1x^3}\phantom{+0x^2+0x+0} \\
1x^4+1x^3+1x^2+0x+0 \\
+\underline{1x^4+0x^3+1x^2}\phantom{+0x+0} \\
1x^3+0x^2+0x+0 \\
+\underline{1x^3+0x^2+1x}\phantom{+0} \\
1x+0 \\
\end{array}
' %}

Now let's look at it with only the coefficients of the polynomials (this is going somewhere, I promise):

{% include equation.html equations='
\begin{array}{r}
1+0+1{\overline{\smash{\big)}\,1+0+0+1+0+1+0+0}} \\
+\underline{1+0+1}\phantom{+0+0+0+0+0} \\
1+1+0+1+0+0 \\
+\underline{1+0+1}\phantom{+0+0+0} \\
1+1+1+0+0 \\
+\underline{1+0+1}\phantom{+0+0} \\
1+0+0+0 \\
+\underline{1+0+1}\phantom{+0} \\
1+0 \\
\end{array}
' %}

Basically, all we're doing is cycling through the data polynomial's coefficients, which happen to be the original binary data bits separated by plus signs, and subtracting the generator polynomial's coefficients whenever a `1` is encountered. `0`s are ignored because the quotient coefficient would be `0` in the actual polynomial division. Because addition, and therefore subtraction, in GF(2) is consistent with an XOR operation, the process demonstrated above can also be viewed as a cyclic, bitwise XOR:

```txt
Useful Data | CRC Value
=======================
     100101 | 00
     101
-----------------------
     001101 | 00
       101
-----------------------
     000111 | 00
        101
-----------------------
     000010 | 00
         10   1
-----------------------
     000000 | 10
=======================
Data to send: 10010110
```

The same process can be performed to verify the intended data is received:

```txt
Useful Data | CRC Value
=======================
     100101 | 10
     101
-----------------------
     001101 | 10
       101
-----------------------
     000111 | 10
        101
-----------------------
     000010 | 10
         10   1
-----------------------
     000000 | 00
Data received successfully.
```

This method makes CRC calculation much easier. Instead of worrying about polynomial division, all we have to do is perform XOR operations.

### Selecting generator polynomials

The selection of a generator polynomial is the most important aspect of a CRC's design. The level of mathematical complexity that can be reached when discussing generator polynomial design is indicative of that importance (that is to say, it can get pretty complicated). As such, I'm only going to touch on three simple, yet notable, factors of generator polynomial selection: polynomial degree, Hamming distance, and burst error detection.

#### Polynomial degree

[Polynomial degree](https://en.wikipedia.org/wiki/Degree_of_a_polynomial){:title="Wikipedia.com - 'Degree of a polynomial'"} is easy, but it leads into the next two factors so I want to quickly discuss it again. The degree of the generator polynomial determines the length of the CRC value. A generator polynomial of degree _n_ (\\(x^n + x^{n-1} + ... + x^1 + x^0\\)), which corresponds to a binary length of _n+1_, produces a CRC value of binary length _n_.

#### Hamming distance

[Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance){:title="Wikipedia.com - 'Hamming distance'"} properties can get more complicated, so I'll just cover the broad strokes. The obvious question that should be answered first: "What is Hamming distance?" In the context of CRCs, we can think of Hamming distance as the number of different bits, or errors, between two binary values, the message that is sent and the message that is received. Some examples:

{% include table.html table='
|     Value Sent      |   Value Received    | Hamming Distance |
| :-----------------: | :-----------------: | :--------------: |
|   **1**0011**0**1   |   **0**0011**1**1   |        2         |
|   **10**011**0**1   |   **01**011**1**1   |        3         |
| **10**0**1**1**0**1 | **01**0**0**1**1**1 |        4         |
' %}

We can associate a generator polynomial with a Hamming distance of _d_ if the generator polynomial is guaranteed to detect all _d-1_ (and fewer) bit errors. Each generator polynomial has specific Hamming distance properties for data of a given length. This is dependent on many factors that I won't go into; however, I will point to [Philip Koopman's page on the best CRC polynomials](https://users.ece.cmu.edu/~koopman/crc/index.html), which catalogues the best _n_-bit polynomials that achieve specific Hamming distances for different data lengths. Koopman also has a paper that spends more time discussing Hamming distance characteristics of 32-bit CRCs, [linked here](https://users.ece.cmu.edu/~koopman/networks/dsn02/dsn02_koopman.pdf).

#### Burst error detection

CRCs are great for detecting [burst errors](https://en.wikipedia.org/wiki/Burst_error){:title="Wikipedia.com - 'Burst error'"}, which, per Wikipedia, are "contiguous sequences of erroneous data symbols in messages." These can be introduced during data transmission by a "burst" of noise or a glitch causing errors in a group of bits. They differ from other independent bit errors because the errors are grouped between an error start-bit and an error end-bit, which are typically separated by a relatively small number of bits.

{% include table.html table='
|      Value Sent      |  Error   |    Value Received    | Burst Error Length |
| :------------------: | :------: | :------------------: | :----------------: |
| 1001101011101**0**01 |    1     | 1001101011101**1**01 |         1          |
| 10011010111**010**01 |   101    | 10011010111**111**01 |         3          |
| 100110**10111010**01 | 10101001 | 100110**00010011**01 |         8          |
' %}

Assuming all generator polynomials have non-zero \\(x^n\\) and \\(x^0\\) terms, all _n_-bit CRCs can detect burst errors of length less than or equal to _n_. This can be proven by viewing the burst error as a polynomial, **E**. So long as **E**'s degree is less than the generator polynomial's degree, **E** can't be divided by the generator polynomial, which will result in a non-zero remainder. In other words, if the error polynomial isn't divisible by the generator polynomial, the error will be detected (this error detection characteristic extends beyond burst errors). This means _n_-bit CRCs can even detect burst errors of length _n+1_ unless the burst error's bits match the generator polynomial's bits. Due to the burst error dectection properties of CRCs, all generator polynomials should use nonzero \\(x^n\\) and \\(x^0\\) terms - as far as I know there are no benefits to breaking this rule.

#### A final note on selection

There are many other factors that can be considered when choosing a polynomial, such as:

- Single-bit error detection - errors defined by the polynomial \\({\bf E}=x^n\\) (a single flipped bit) can always be detected so long as the generator polynomial has two bits set to `1`.
- Two-bit error detection - errors defined by the polynomial \\({\bf E}=x^n + x^m\\) (two flipped bits), where _n_ and _m_ are separated by a specific number of bits, can be detected by choosing generator polynomials with specific primitive polynomials as factors (is this description nebulous enough?).
- Odd-bit error detection - all errors with an odd number of `1` bits (ex. `111`, `1011`, `10`, etc.) can be detected by choosing a generator polynomial that is a multiple of \\(x+1\\) (a generator polynomial with an even number of `1` bits); however, these same generator polynomials are ~twice as likely <em>not</em> to detect errors with an even number of bits.

I point all this out to further back up the statement I'm about to make: Any CRC implementation should search for and use a polynomial for which the characteristics are already known and understood. As Ross Williams says in his [painless guide to CRC error detection algorithms](http://ross.net/crc/download/crc_v3.txt), it's best "to put the fear of death into anyone who so much as toys with the idea of making up their own poly." There is likely a well-documented generator polynomial for most any use-case.

## Naming conventions and polynomial representations

Why, so far, have I referred to CRCs in two ways: _n_-bit CRC and CRC-*n*? CRCs are typically named based on the degree of their generator polynomial. This means a CRC-16, or 16-bit CRC, has the following characteristics:

- A generator polynomial of degree 16 (\\(x^{16} + ...\\)), which corresponds to a binary length of 17 bits (_n+1_)
- A binary CRC value with a length of 16 bits (_n_)

If you take a look at the [common CRCs on Wikipedia](https://en.wikipedia.org/wiki/Cyclic_redundancy_check#Polynomial_representations_of_cyclic_redundancy_checks), though, you'll probably notice that there are multiple versions of most _n_-bit CRCs, and, to further confuse things, the polynomials can be represented in multiple ways.

The reason for the multiple versions of particular _n_-bit CRCs is because different organizations and applications perform them in different ways. The most common difference comes from the use of different generator polynomials of the same degree. Even when the same polynomial is used, one application might XOR the final CRC with a specific, non-zero value, while another might reverse the bits of the CRC value after calculations are completed. The most common CRCs are typically named based on the person or organization that popularized their use (ex. the CRC-32K named after [Philip Koopman](https://users.ece.cmu.edu/~koopman/)). Minor parameter changes (that is, parameters other than the generator polynomial) can be made to improve specific error detection characteristics of a given polynomial or decrease the implementation complexity for a specific piece of hardware; other times, parameters are changed as a matter of style. Common parameters that distinguish different _n_-bit CRCs are:

- **Generator Polynomial** - for an _n_-bit CRC, this is a binary value of length _n+1_ that represents the CRC's divisor. Unlike the other parameters listed below, changing this parameter can dramatically alter the characteristics of a given _n_-bit CRC.
- **Initial Value** - the inital state of the CRC value before performing the CRC computation. This parameter will probably make more sense after I discuss the [shift register implementation](#shift-register-in-software) later in this post.
- **Reflect In** - determines if each input byte of the data is reflected, or bit-reversed, before being processed in the CRC computation. This is usually `True` if **Reflect Out** is `True`.
- **Reflect Out** - determines if the output of the CRC computation, that being the final CRC value, is reflected, or bit-reversed. This is usually `True` if **Reflect In** is `True`.
- **XOR Out** - a binary value with which the final CRC value is XORed after all other computations are completed.

You can see all these parameters in action on [crccalc.com](https://crccalc.com/).

Another thing you'll undoubtedly come across if you spend any length of time learning about CRCs is that there isn't a single standard for representing the all-important generator polynomial. Different implementations represent the same polynomials with different bits (polynomial terms/powers) omitted. More information can be found in the [CRC Specification section on Wikipedia](https://en.wikipedia.org/wiki/Cyclic_redundancy_check#Specification), but I'll briefly touch on some of the most commonly used polynomial representations:

- **Normal** - the polynomial is displayed most-significant bit (MSB) to least-significant bit (LSB) with the highest-order (left-most) bit omitted, as it is always `1`.
- **Reversed** - the polynomial is displayed LSB to MSB with the highest-order (right-most) bit omitted, as it is always `1`. This is equivalent to the Normal representation reflected, or bit-reversed.
- **Reciprocal** - the [polynomial is displayed as its reciprocal](https://en.wikipedia.org/wiki/Reciprocal_polynomial){:title="Wikipedia.com - 'Reciprocal polynomial'"} with the highest-order (left-most) bit, previously the lowest-order bit in Normal and Reversed form, omitted, as it is always `1`. "Reciprocal" means the polynomial is effectively bit-reversed and the MSB is assigned to the left-most bit (previously the LSB). For example, `10011`, displayed here MSB-first, has an MSB-first reciprocal of `11001`.
- **Reversed Reciprocal** - the polynomial is displayed as its bit-reversed (LSB to MSB) reciprocal with the highest-order (right-most) bit omitted, as it is always `1`.

While using different polynomial representations won't change the error detection properties of a particular polynomial, it can change the CRC value obtained. With these four polynomial representations, the CRC-16-CCITT polynomial, \\(x^{16} + x^{12} + x^5 + 1\\), whose full binary value is `1 0001 0000 0010 0001`, can be represented as:

```txt
Normal              : 0x1021
Reversed            : 0x8408
Reciprocal          : 0x0811
Reversed Reciprocal : 0x8810
--------------------------------
Normal (16 to 0)
Full Poly: 1 0001 0000 0010 0001
0x1021   :   0001 0000 0010 0001
--------------------------------
Reversed (0 to 16)
Full Poly: 1000 0100 0000 1000 1
0x8408   : 1000 0100 0000 1000
--------------------------------
Reciprocal (16 to 0)
Full Poly: 1 0000 1000 0001 0001
0x0811   :   0000 1000 0001 0001
--------------------------------
Reversed Reciprocal (0 to 16)
Full Poly: 1000 1000 0001 0000 1
0x8810   : 1000 1000 0001 0000
```

The four listed above are those found in the [CRC Wikipedia article](https://en.wikipedia.org/wiki/Cyclic_redundancy_check), but there are other ways people represent them (as an example, by <em>not</em> excluding bits). I'm partial to the Normal representation because it's the most widely used ([crccalc.com](https://crccalc.com/) uses this), but understanding the Reversed and Reversed Reciprocal notations are beneficial if you want to use [Koopman's impressive CRC Polynomial catalogue](https://users.ece.cmu.edu/~koopman/crc/index.html).

## Implementing CRCs

There are a lot of ways to implement CRCs, both in hardware and in software. I want to focus on a few software implementations. Before we start, note that all software implementations I'm introducing assume the polynomial is specified with the most-significant and least-significant bits included. So, the CRC-16-CCITT polynomial (`0x1021` in Normal representation) is assumed to be passed in as `0x11021`. Additionally, all implementations are written in Python because I think it's easier to follow. This does present two complications though. Unlike integers in languages such as C, C++, etc., bit-shifting `int` values in Python adds or removes bits, and leading `0`-bits of `int` values are disregarded. For example:

```c
// C:
uint8_t x = 0b10011001
x << 1  // returns: 0b00110010
x >> 1  // returns: 0b01001100
```

```python
# python
x = 0b10011001
x << 1  # returns: 0b100110010
x >> 1  # returns: 0b11001
```

The solution to these complications is simple: bit masking. The downside is the code becomes slightly more verbose, but I think it's outweighed by the readability benefit of Python.

### Simple Python implementation

I'll start with an implementation of [the first CRC calculation algorithm I demonstrated earlier in this post](#doesnt-this-seem-a-little-overly-complex). The algorithm is:

1. Convert the data bytes into a single integer value.
2. Align the most-significant bits of the generator polynomial and the data.
   1. Left-shift the generator polynomial by 1 less than the number of bits in the data (data bit length - 1).
   2. Left-shift the data by 1 less than the number of bits in the generator polynomial (generator polynomial bit length - 1). This adds the placeholder bits to the data.
3. While the shifted polynomial value is greater than or equal to the original polynomial:
   1. If the most significant bit of the shifted polynomial is aligned with a `1` in the shifted data value:
      - Assign the shifted data value to the XOR of the shifted data value and the shifted polynomial value.
   2. Right-shift the polynomial value once.
4. Return the final shifted data value.

Here's how it can be implemented in Python [Edit: Before looking at this implementation, please note that it <em>should not</em> be used in practice. I'm not recommending it. It's completely dependent on characteristics of Python, and it won't work if it's ported to other languages like C, C++, etc. I'm including it just to bridge the gap between the algorithm I introduced earlier, which I think is relatively easy to grasp, and the implementations of the algorithms I'll show next.]:

```python
def get_crc(data: bytearray, poly: int) -> int:
    data_int = int.from_bytes(data, 'big')
    p = poly << (data_int.bit_length() - 1)
    crc = data_int << (poly.bit_length() - 1)
    msb = 1 << (p.bit_length() - 1)
    while p >= poly:
        if crc & msb:
            crc ^= p
        msb >>= 1
        p >>= 1
    return crc
```

The code above returns in the correct CRC value for both large and small generator polynomials. The code block below shows the result of the example covered in this post (data of `100101` and generator polynomial of `101`) as well as a more complex example using the CRC-16-CCITT generator polynomial.

```python
>>> bin(get_crc(bytearray.fromhex("25"), 0x5))
'0b10'
>>> hex(get_crc(bytearray.fromhex("9ea43100ab93"), 0x11021))
'0xc566'
```

The primary problems with this implementation is that it doesn't easily support the addition of all the common CRC parameters and it is heavily dependent on characteristics of the Python language. Most parameters are trivial to implement, but adding support for an initial CRC value quickly becomes more trouble than it's worth. This capability is easier to implement if we make certain assumptions, but these assumptions aren't even necessary for shift register software implementations.

### Shift register in software

CRCs are commonly implemented in hardware with [shift registers](https://en.wikipedia.org/wiki/Shift_register){:title="Wikipedia.com - 'Shift register'"}. Since some software implementations base their algorithm off this, it's useful to understand. I won't really get into the hardware aspect of shift registers, but if you want more information on that, just check out:

- The [Wikipedia article on shift registers](https://en.wikipedia.org/wiki/Shift_register)
- Any of the tutorials that can be found with a [Google search for "shift register"](https://www.google.com/search?q=shift+register)
- [Ben Eater's excellent video on implementing a CRC calculation in hardware](https://www.youtube.com/watch?v=sNkERQlK8j8)

For this post, it's only important that we know a shift register can be visualized as a group of storage bins to which the data we want to send queues up:

```txt
   | --- | --- |    useful data   placeholder bits
   |     |     | <--     100101                 00
   | --- | --- |
1     0     1
```

Instead of the method I outlined above, in which the polynomial was shifted along the data bits from left to right, in this method the polynomial remains with the shift register into which the data bits are moved. The CRC value is the content of the shift register at the end of the calculation. The algorithm is:

1. Shift data bits, one-by-one, into the shift register.
2. When a `1` bit is shifted <em>out</em> of the shift register, XOR the values in the shift register with the generator polynomial.
3. Continue steps 1 and 2 until no data bits remain.
4. The final value in the shift register is the CRC value.

The shift register size determines the size of the CRC value. Here's the same CRC calculation we performed earlier using the shift register algorithm:

```txt
# Generator polynomial presented in brackets: [101]

      | --- | --- |
      |     |     | <-- 10010100
      | --- | --- |
      |     |  1  | <-- 0010100
      | --- | --- |
      |  1  |  0  | <-- 010100
      | --- | --- |
      |  1  |  0  | <-- 10100
      | --- | --- |
[  1     0     1  ]
      | --- | --- |
 XOR: |  0  |  1  | <-- 10100
      | --- | --- |
   0  |  1  |  1  | <-- 0100
      | --- | --- |
   1  |  1  |  0  | <-- 100
      | --- | --- |
[  1     0     1  ]
      | --- | --- |
 XOR: |  1  |  1  | <-- 100
      | --- | --- |
   1  |  1  |  1  | <-- 00
      | --- | --- |
[  1     0     1  ]
      | --- | --- |
 XOR: |  1  |  0  | <-- 00
      | --- | --- |
   1  |  0  |  0  | <-- 0
      | --- | --- |
[  1     0     1  ]
      | --- | --- |
 XOR: |  0  |  1  | <-- 0
      | --- | --- |
   0  |  1  |  0  | <--
      | --- | --- |

CRC Value:
| --- | --- |
|  1  |  0  |
| --- | --- |
```

The CRC value obtained here is the same as was obtained early on in this post. Now that this process has been visualized, we can start covering some actual software implementations.

While the [simple Python implementation](#simple-python-implementation) I just went over works for CRCs of any size, there are two shift register implementations. One is used for less-than-8-bit CRCs, and another is used for greather-than-or-equal-to-8-bit CRCs. It's uncommon for CRCs smaller than 8 bits to be used, but I'll quickly cover them anyway. The shift register algorithm for small CRCs is:

1. Initialize the CRC register value.
2. For each byte in the useful data:
   - For each bit in the current byte:
     1. If the shift register's most-significant bit is `1`:
        1. Shift the most-significant bit out of the register and the next data bit into the register.
        2. XOR the register with the generator polynomial.
     2. Otherwise, shift the most-significant bit out of the register and the next data bit into the register.
3. For each placeholder bit (i.e. loop _n_ times for an _n_-bit CRC):
   1. If the shift register's most-significant bit is `1`:
      1. Shift the most-significant bit out of the register and the next placeholder bit into the register.
      2. XOR the register with the generator polynomial.
   2. Otherwise, shift the most-significant bit out of the register and the next placeholder bit into the register.
4. Return the final value in the register.

Here's a possible way of implementing the small CRC shift register algorithm in software (note the use of bit masks to keep a consistent CRC size):

```python
def get_small_crc_shift(data: bytearray, poly: int) -> int:
    crc = 0
    poly_length = poly.bit_length()
    msb = 1 << (poly_length - 2)
    width = ((2 ** (poly_length - 1)) - 1)
    for byte in data:
        for i in range(7, -1, -1):
            if crc & msb:
                crc = ((crc << 1) & width)
                if byte & (1 << i):
                    crc |= 1
                else:
                    crc &= 0xfe
                crc ^= poly
            else:
                crc = ((crc << 1) & width)
                if byte & (1 << i):
                    crc |= 1
                else:
                    crc &= 0xfe
    for _ in range(poly_length - 1):
        if crc & msb:
            crc = ((crc << 1) & width) & 0xfe
            crc ^= poly
        else:
            crc = ((crc << 1) & width) & 0xfe
    return crc
```

This requires much more code than the simple python implementation, but it gets the job done (at least, it does for small CRCs).

```python
>>> bin(get_small_crc_shift(bytearray.fromhex("25"), 0x5))
'0b10'
```

Things get much simpler when we work with CRCs of size 8 or greater because we can shift entire bytes into the register at a time. The algorithm is:

1. Initialize the CRC register value.
2. For each byte in the useful data:
   1. Shift the entire data byte into the register (i.e. XOR the most-significant byte of the register with the data byte)
   2. For each bit in the current byte:
      1. If the shift register's most-significant bit is `1`:
         - Shift the most-significant bit out of the register and the next data bit into the register.
         - XOR the register with the generator polynomial.
      2. Otherwise, shift the most-significant bit out of the register and the next data bit into the register.
3. Return the final value in the register.

I found it difficult to grasp the fact that XORing the next data byte with the register's most-significant byte after processing the current byte results in the same register value as feeding in the data bit-by-bit (even that sentence was a mouthful). This can be shown with a simple example though:

```txt
BIT-BY-BIT METHOD:
POLYNOMIAL:   100100101
CURRENT BYTE: 10011001
NEXT BYTE:    10100010
  10011001 10100010
-------------------
1 0011001 10100010
1 0010010 1 (XOR POLY)
-------------------
  0001011 00100010
-------------------
  001011 00100010
-------------------
  01011 00100010
-------------------
  1011 00100010
-------------------
1 011 00100010
1 001 00101 (XOR POLY)
-------------------
  010 00001010
-------------------
  10 00001010
-------------------
1 0 00001010
1 0 0100101 (XOR POLY)
-------------------
  0 01000000
-------------------
  01000000

=======================

XOR METHOD:
POLYNOMIAL:   100100101
CURRENT BYTE: 10011001
NEXT BYTE:    10100010
  10011001 00000000
-------------------
1 0011001 00000000
1 0010010 1 (XOR POLY)
-------------------
  0001011 10000000
-------------------
  001011 10000000
-------------------
  01011 10000000
-------------------
  1011 10000000
-------------------
1 011 10000000
1 001 00101 (XOR POLY)
-------------------
  010 10101000
-------------------
  10 10101000
-------------------
1 0 10101000
1 0 0100101 (XOR POLY)
-------------------
  0 11100010
-------------------
  11100010
  10100010 (XOR NEXT BYTE)
-------------------
  01000000
```

In both cases, the register value at the start of processing the "next" byte is `01000000`. Here's a possible way of implementing the CRC shift register algorithm in software:

```python
def get_crc_shift(data: bytearray, poly: int) -> int:
    crc = 0
    poly_length = poly.bit_length()
    msb = 1 << (poly_length - 2)
    width = (2 ** (poly_length - 1)) - 1
    msb_shift = poly_length - 9
    for byte in data:
        crc ^= (byte << msb_shift)
        for _ in range(8):
            if crc & msb:
                crc = ((crc << 1) & width) ^ poly
            else:
                crc = ((crc << 1) & width)
    return crc
```

This function also outputs as expected.

```python
>>> hex(get_crc(bytearray.fromhex("9ea43100ab93"), 0x11021))
'0xc566'
```

We can even modify this function to support all five common CRC parameters!

```python
def get_reflected_bits(data: int) -> int:
    rev = 0
    byte = data
    while byte > 0:
        rev <<= 1
        if byte & 1 == 1:
            rev ^= 1
        byte >>= 1
    rev <<= ((8 - (data.bit_length() % 8)) % 8)
    return rev

def get_crc_shift(data: bytearray, poly: int, init: int, ref_in: bool,
                  ref_out: bool, xor_out: int) -> int:
    crc = init
    poly_length = poly.bit_length()
    msb = 1 << (poly_length - 2)
    width = (2 ** (poly_length - 1)) - 1
    msb_shift = poly_length - 9
    for byte in data:
        if ref_in:
            byte = get_reflected_bits(byte)
        crc ^= (byte << msb_shift)
        for _ in range(8):
            if crc & msb:
                crc = ((crc << 1) & width) ^ poly
            else:
                crc = ((crc << 1) & width)
    if ref_out:
        crc = get_reflected_bits(crc)
    return crc ^ xor_out
```

This function is capable of computing a bunch of popular CRC algorithms.

```python
>>> # CRC-8-CCITT_ITU
... hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), 0x107, 0x00, False, False, 0x55))
'0x22'
>>> # CRC-8-DARC
... hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), 0x139, 0x00, True, True, 0x00))
'0x2b'
>>> # CRC-16-CCITT_XMODEM
... hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), 0x11021, 0x0000, False, False, 0x0000))
'0xc566'
>>> # CRC-16-CCITT_X-25
... hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), 0x11021, 0xffff, True, True, 0xffff))
'0xf3e7'
>>> # CRC-16-IBM/ANSI_USB
... hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), 0x18005, 0xffff, True, True, 0xffff))
'0xe2a3'
>>> # CRC-32-Ethernet
... hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), 0x104c11db7, 0xffffffff, True, True, 0xffffffff))
'0x7f6bd7de'
```

This implementation is great, but it still requires iteration over <em>every bit</em> of <em>every byte</em> of data. There's one more CRC software implementation I want to cover that only requires iteration over <em>every byte</em> of data.

### Table lookup

In the last section I showed that CRC calculations can be processed a byte at a time instead of bit-by-bit. The next implementation takes advantage of that property by creating a lookup table for every possible byte of data for a given polynomial. The table can be created at the start of an application, so calculating the CRC value just becomes a series of table lookups - this gives a significant performance increase! Tables also only contain 256 bytes of data, which is negligible for almost any modern computer. Creating the lookup table for a polynomial is very similar to the shift register implementation:

```python
class CrcTable(dict):
    def __init__(self, *args, poly: int, **kwargs):
        super().__init__(*args, **kwargs)
        self.poly = poly

def get_crc_table(poly: int) -> dict:
    table = CrcTable(poly=poly)
    poly_length = poly.bit_length()
    msb = 1 << (poly_length - 2)
    width = (2 ** (poly_length - 1)) - 1
    msb_shift = poly_length - 9
    for byte in range(256):
        crc = (byte << msb_shift)
        for _ in range(8):
            if crc & msb:
                crc = ((crc << 1) & width) ^ poly
            else:
                crc = ((crc << 1) & width)
        table[byte] = crc
    return table
```

The code for computing CRCs with a lookup table is simple:

```python
def get_crc(data: bytearray, table: CrcTable) -> int:
    crc = 0
    poly_length = table.poly.bit_length()
    width = (2 ** (poly_length - 1)) - 1
    msb_shift = poly_length - 9
    for byte in data:
        b = byte ^ (crc >> msb_shift)
        crc = (table[b] ^ (crc << 8)) & width
    return crc
```

And it works!

```python
>>> table = get_crc_table(0x11021)
>>> print(hex(get_crc(bytearray.fromhex("9ea43100ab93"), table)))
0xc566
```

Just like with the shift register implementation, adding support for all five CRC parameters is easy:

```python
class CrcTable(dict):
    def __init__(self, *args, poly: int, **kwargs):
        super().__init__(*args, **kwargs)
        self.poly = poly

class CrcParameters:
    def __init__(self, poly: int, init: int, ref_in: bool,
                 ref_out: bool, xor_out: int):
        self.poly = poly
        self.init = init
        self.ref_in = ref_in
        self.ref_out = ref_out
        self.xor_out = xor_out

def get_reflected_bits(data: int) -> int:
    rev = 0
    byte = data
    while byte > 0:
        rev <<= 1
        if byte & 1 == 1:
            rev ^= 1
        byte >>= 1
    rev <<= ((8 - (data.bit_length() % 8)) % 8)
    return rev

def get_crc_table(params: CrcParameters) -> dict:
    table = CrcTable(poly=params.poly)
    poly_length = params.poly.bit_length()
    msb = 1 << (poly_length - 2)
    width = (2 ** (poly_length - 1)) - 1
    msb_shift = poly_length - 9
    for byte in range(256):
        crc = (byte << msb_shift)
        for _ in range(8):
            if crc & msb:
                crc = ((crc << 1) & width) ^ params.poly
            else:
                crc = ((crc << 1) & width)
        table[byte] = crc
    return table

def get_crc(data: bytearray, table: CrcTable, params: CrcParameters) -> int:
    crc = params.init
    poly_length = params.poly.bit_length()
    width = (2 ** (poly_length - 1)) - 1
    msb_shift = poly_length - 9
    for byte in data:
        if params.ref_in:
            byte = get_reflected_bits(byte)
        b = byte ^ (crc >> msb_shift)
        crc = (table[b] ^ (crc << 8)) & width
    if params.ref_out:
        crc = get_reflected_bits(crc)
    return crc ^ params.xor_out
```

Just like with the shift register implementation, this parameterized table lookup can compute many popular CRC algorithms.

```python
>>> # CRC-8-CCITT_ITU
... params = CrcParameters(0x107, 0x00, False, False, 0x55)
>>> table = get_crc_table(params)
>>> hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), table, params))
'0x22'
>>> # CRC-16-CCITT_X-25
... params = CrcParameters(0x11021, 0xffff, True, True, 0xffff)
>>> table = get_crc_table(params)
>>> hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), table, params))
'0xf3e7'
>>> # CRC-32-Ethernet
... params = CrcParameters(0x104c11db7, 0xffffffff, True, True, 0xffffffff)
>>> table = get_crc_table(params)
>>> hex(get_crc_shift(bytearray.fromhex("9ea43100ab93"), table, params))
'0x7f6bd7de'
```

My implementation can still be improved though. If we assume `ref_in` and `ref_out` are always the same (which is almost always the case), when both are `True` a reflected table can be generated:

```python
class CrcTable(dict):
    def __init__(self, *args, poly: int, **kwargs):
        super().__init__(*args, **kwargs)
        self.poly = poly

class CrcParameters:
    def __init__(self, poly: int, init: int, ref_in: bool,
                 ref_out: bool, xor_out: int):
        self.poly = poly
        self.init = init
        self.ref_in = ref_in
        self.ref_out = ref_out
        self.xor_out = xor_out

def get_reflected_bits(data: int, length: int) -> int:
    rev = 0
    d = data
    for i in range(length - 1, -1, -1):
        rev |= (d & 1) << i
        d >>= 1
    return rev

def get_crc_table(params: CrcParameters) -> dict:
    table = CrcTable(poly=params.poly)
    crc_length = params.poly.bit_length() - 1
    msb = 1 << (crc_length - 1)
    width = (2 ** (crc_length)) - 1
    msb_shift = crc_length - 8
    for byte in range(256):
        if params.ref_in:
            crc = get_reflected_bits(byte, crc_length)
        else:
            crc = byte << msb_shift
        for _ in range(8):
            if crc & msb:
                crc = ((crc << 1) & width) ^ params.poly
            else:
                crc = ((crc << 1) & width)
        if params.ref_in:
            crc = get_reflected_bits(crc, crc_length)
        table[byte] = crc
    return table

def get_crc(data: bytearray, table: CrcTable, params: CrcParameters) -> int:
    crc = params.init
    poly_length = params.poly.bit_length()
    width = (2 ** (poly_length - 1)) - 1
    msb_shift = poly_length - 9
    if params.ref_out:
        crc = get_reflected_bits(crc, poly_length - 1)
        for byte in data:
            b = (crc ^ byte) & 0xff
            crc = table[b] ^ (crc >> 8)
    else:
        for byte in data:
            b = byte ^ (crc >> msb_shift)
            crc = (table[b] ^ (crc << 8)) & width
    return crc ^ params.xor_out
```

I would show the output of this `get_crc` function, but it's no different than the previous parameterized table lookup output I showed above. I think creating the reflected table is straightforward - it's just storing the reflected CRC for a given byte, which means we don't need to reflect the input byte when using the table. On the other hand, the process of using the reflected table wasn't abundantly clear to me right off the bat. It finally clicked for me when I realized the lookup table keys are associated with the <em>least</em>-significant byte in the register as opposed to the <em>most</em> significant byte (remember, everything is reflected now). If this doesn't immediately make sense, try performing a reflected calculation by hand.

The table lookup CRC implementation is far and away the best option for computing CRCs in software, especially if your application is expected to use a single CRC algorithm.

## Wrapping up

I could keep discussing CRCs, but I think what I've gone over so far is more than enough for this post. Let me know if I got something wrong! Hopefully I gave a reasonably clear and easily understandable introduction to some of the concepts surrounding CRCs. If this post piqued your interest in CRCs or left some questions unanswered, be sure to check out my references and do some searching online for things I didn't cover.

## Primary references

I probably missed a few (and I'll update this list if I notice that's the case), but this list contains nearly everything I used while making this article.

- [Ross Williams' excellent "A Painless Guide to CRC Error Detection Algorithms"](http://ross.net/crc/download/crc_v3.txt) (check out his site, [The CRC Pitstop](http://ross.net/crc/index.html), for a trip back to 1996)
- [Ben Eater's YouTube playlist on error detection](https://www.youtube.com/playlist?list=PLowKtXNTBypFWff2QjXCWuSfJDWcvE0Vm)
- From Wikipedia:
  - [Cyclic redundancy check](https://en.wikipedia.org/wiki/Cyclic_redundancy_check)
  - [Computation of cyclic redundancy checks](https://en.wikipedia.org/wiki/Computation_of_cyclic_redundancy_checks)
  - [Mathematics of cyclic redundancy checks](https://en.wikipedia.org/wiki/Mathematics_of_cyclic_redundancy_checks)
  - [Finite field](https://en.wikipedia.org/wiki/Finite_field)
  - [GF(2)](https://en.wikipedia.org/wiki/GF(2))
  - [Error detection and correction](https://en.wikipedia.org/wiki/Error_detection_and_correction)
  - [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance)
  - [Burst error](https://en.wikipedia.org/wiki/Burst_error)
  - [Shift register](https://en.wikipedia.org/wiki/Shift_register)
- From Philip Koopman:
  - [Best CRC Polynomials](https://users.ece.cmu.edu/~koopman/crc/index.html)
  - [CRC Polynomial Zoo](https://users.ece.cmu.edu/~koopman/crc/crc32.html)
  - [32-Bit Cyclic Redundancy Codes for Internet Applications](https://users.ece.cmu.edu/~koopman/networks/dsn02/dsn02_koopman.pdf)
- [Michael Barr's "CRC Series, Part 3: CRC Implementation Code in C/C++](https://barrgroup.com/Embedded-Systems/How-To/CRC-Calculation-C-Code) (I didn't use them much, but here's [Part 1](https://barrgroup.com/Embedded-Systems/How-To/Additive-Checksums) and [Part 2](https://barrgroup.com/Embedded-Systems/How-To/CRC-Math-Theory) as well)
- [The Online CRC Calculator](https://crccalc.com/) (and [associated C# source code on GitHub](https://github.com/meetanthony/crccsharp))
- [CRC RevEng Catalogue of parametrised CRC algorithms](http://reveng.sourceforge.net/crc-catalogue/)
- [Bastian Molkenthin's "Understanding and implementing CRC calculation"](http://www.sunshine2k.de/articles/coding/crc/understanding_crc.html)
