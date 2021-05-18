
;; Inv(x, y, z, i)
(declare-rel Inv ( Int Int Int Int) )
(declare-rel Error () )
(declare-var A Int )
(declare-var B Int )
(declare-var C Int )
(declare-var D Int )
(declare-var C1 Int )
(declare-var D1 Int )

(rule (=> (and (> B 0) (= C A) (= D 0))
            (Inv A B C D)))
(rule (=> (and (Inv A B C D) (< D B) (= C1 (+ C 1)) (= D1 (+ D 1)))
          (Inv A B C1 D1)
          )
         )
 
(rule         (=> (and (Inv A B C D) (>= D B) (not (= C (+ A B))))
            Error
            )
         )
(query Error)

