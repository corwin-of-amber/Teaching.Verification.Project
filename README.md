## 236347 Project in Software Verification

This repository contains a few example C programs to use as benchmarks.

### Quick reference

 * To generate an AST from a C source file:
```
% node ext/sindarin.js parse benchmarks/c/max3.c
```

 * If source file contains macros and other directives, it must
   be preprocessed first.
```
% cpp -P benchmarks/c/array.c > array.ii
% node ext/sindarin.js parse array.ii
```
