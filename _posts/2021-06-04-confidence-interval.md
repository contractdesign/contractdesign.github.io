Interpretation of Confidence Intervals
================

A 95% confidence interval (CI) for an estimated parameter means that if
the experiment were conducted 100 times, the estimated parameter will
fall within the confidence interval 95 times on average. It does not
mean that there is a 95% chance that the estimated parameter falls in
within a given CI. In fact, for a given CI, there could be a 100% chance
that it doesn’t fall with in the range. (see [this
link](https://www.statisticssolutions.com/misconceptions-about-confidence-intervals/)).

Let’s try an example. We’ll generate 100 “experiments” by taking 10
random samples from a normal distribution N(0, 1) 100 times. We’ll
compute the 95% confidence interval for the sample mean, and count how
many times the actual mean falls within the confidence interval.

``` r
library(Rmisc)

mean_real <- 0 # real mean to be estimated
n <- 100       # number of experiments
valid <- 0     # counter for number of 

for(i in 0:n){
  data <- rnorm(10, mean=mean_real)
  ci <- CI(data, ci=0.95)
  
  # check if real mean falls within the CI
  if(mean_real < ci["lower"] || mean_real > ci["upper"]) {
    print(sprintf('estimate %f of real mean (%f) falls outside of [%f, %f]',
                  ci["mean"], mean_real, ci["lower"], ci["upper"]))
  } else {
    valid <- valid + 1
  }
}
```

    ## [1] "estimate 0.594941 of real mean (0.000000) falls outside of [0.110916, 1.078965]"
    ## [1] "estimate -0.880686 of real mean (0.000000) falls outside of [-1.655264, -0.106108]"
    ## [1] "estimate 0.686859 of real mean (0.000000) falls outside of [0.015411, 1.358306]"
    ## [1] "estimate 0.801510 of real mean (0.000000) falls outside of [0.264519, 1.338501]"

Observe that in each of the failing cases above the estimated mean falls
outside of the CI 100% of the time.

The result changes every time we run, but in this case the CI captured
the estimated mean this often:

``` r
valid/n
```

    ## [1] 0.97
