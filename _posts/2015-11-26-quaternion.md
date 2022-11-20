---
layout: post
title: Haskell Code to Manipulate Quaternions
category: programming
tags: haskell
---
Haskell code to manipulate Quaternions

{% highlight haskell %}
{-
Quaternions.hs:manipulate Quaternions as Num
-}

module Quaternion where

-- TODO: consider parameterizing Q
data Q a = Q a a a a deriving (Eq)
--           ^ ^ ^ ^
--           | i j k
--           + real number
instance (RealFloat a, Show a) => Show (Q a) where
  show q = sa ++ sb ++ sc ++ sd ++ send
    where a = getReal q
          b = getI q
          c = getJ q
          d = getK q
          sa = printTerm a ""
          sb = printTerm b "i"
          sc = printTerm c "j"
          sd = printTerm d "k"
          send = if a==0 && b==0 && c==0 && d==0 then "0" else ""


printTerm a suffix
  | a == 0.0 = ""
  | otherwise = " + " ++ show a ++ suffix

instance (RealFloat a) => Num (Q a) where
  -- return the sum of two quaternions
  (Q a1 b1 c1 d1) + (Q a2 b2 c2 d2) =
    Q (a1 + a2) (b1 + b2) (c1 + c2) (d1 + d2)

  -- return the difference between two quaternions
  (Q a1 b1 c1 d1) - (Q a2 b2 c2 d2) =
    Q (a1 - a2) (b1 - b2) (c1 - c2) (d1 - d2)

  -- return the product of two quaternions
  (Q a1 b1 c1 d1) * (Q a2 b2 c2 d2) =
    Q (a1*a2 - b1*b2 - c1*c2 - d1*d2)
     (a1*b2 + b1*a2 + c1*d2 - d1*c2)
     (a1*c2 - b1*d2 + c1*a2 + d1*b2)
      (a1*d2 + b1*c2 - c1*b2 + d1*a2)

  -- return the negation of a quaternion
  negate (Q a b c d) = Q (negate a) (negate b) (negate c) (negate d)

  -- return the norm of a quaternion
  -- TODO: fix this
--  abs (Q a b c d) = sqrt (a*a + b*b + c*c + d*d)
  abs q = undefined

  -- TODO: what would a signum be for a Quaternion
  signum q = undefined

  -- return an integer as a quaternion
  fromInteger n = Q (fromIntegral n) 0.0 0.0 0.0


-- return the conjugate
--conjugate :: Q -> Q
conjugate (Q a b c d) = Q a (negate b) (negate c) (negate d)

-- return the norm
--norm :: Q -> Float
norm :: (RealFloat a) => Q a -> a
norm (Q a b c d) = sqrt (a*a + b*b + c*c + d*d)


normalize q
  | n == 0.0  = error "norm is zero"
  | otherwise =  (Q (1/n) 0.0 0.0 0.0) * q -- TODO: finish
  where n = norm q

-- extract the real, i, j, k portions of a quaternion
getReal (Q a b c d) = a
getI (Q a b c d) = b
getJ (Q a b c d) = c
getK (Q a b c d) = d

{% endhighlight %}
