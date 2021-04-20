(declare-const x Int)
(declare-const y Int)
(declare-const z Int)
(declare-const a1 (Array Int Int))
(declare-const a2 (Array Int Int))

(assert (= (select a1 x) z))
(assert (= a2 (store a1 x y)))
(assert (= a1 a2))

(assert (not (= z y)))

(check-sat)
(get-model)