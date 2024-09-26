# Your first assertion

<code class="language-kye">assert</code> statements invalidate any data where
the expression evaluates to false.

For the following data it looks like Jill's age has been accidentally set to
the year she was born, not her age. Let's flag this by making sure the age
value is less than 100

Add this assertion to the Model:
```kye
assert age < 100
```

Remember to click the "Run" button after you have made changes