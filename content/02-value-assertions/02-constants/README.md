# Constants

Sometimes we have columns that are always the
same value. As a shortcut instead of writing

```kye
store: String
assert store == "SuperMart"
```

we can simplify it, by specifying the constant
value instead of the type
```kye
store: "SuperMart"
```

Make this change to the code and try it out
by changing one of the store values to something
other than "SuperMart"