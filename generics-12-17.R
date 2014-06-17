library(rjson)

rdata = read.table("~/CoCoLab/generics/generics-12-17.results", sep="\t", header=T, colClasses=c("factor", "factor", "factor", "numeric"))

error.bar <- function(x, y, upper, lower=upper, lw=2, col="black", length=0.1,...){
  if(length(x) != length(y) | length(y) !=length(lower) | length(lower) != length(upper))
    stop("vectors must be same length")
  arrows(x, upper, x, lower, angle=90, code=3, lwd=2, col=col, length=length, ...)
}
conf.mean = function(x, factors, d) {
  #confidence interval functions:
  conf <- function(v, n) {
    v <- v[is.na(v) == F]
    sample.means <- replicate(1000, mean(sample(v, n, replace=TRUE)))
    return(quantile(sample.means, c(0.025, 0.975)))
  }
  lower.conf <- function(v, n=10) { conf(v, n)[["2.5%"]] }
  higher.conf <- function(v, n=10) { conf(v, n)[["97.5%"]] }
  
  #aggregations:
  by = lapply(factors, function(f) {d[[f]]})
  mean.data = aggregate(x=d[[x]], by=by, FUN=mean)
  lower.data = aggregate(x=d[[x]], by=by, FUN=lower.conf)
  higher.data = aggregate(x=d[[x]], by=by, FUN=higher.conf)
  names(mean.data) = c(factors, x)
  names(lower.data) = c(factors, x)
  names(higher.data) = c(factors, x)

  # matching rows error check:
  sapply(factors, function(f) {if (sum(!c(lower.data[[f]] == higher.data[[f]], lower.data[[f]] == mean.data[[f]])) != 0) {print("error1")}})
 
  #combine into one data frame:
  mean.data$lower = lower.data[[x]]
  mean.data$higher = higher.data[[x]]
  return(mean.data)
}

mean.data = conf.mean("response", c("distribution", "utteranceType"), rdata)

fit = lm(response~distribution*utteranceType, data=rdata)
print(anova(fit))

mean.data = mean.data[order(mean.data$distribution),]
mean.data = mean.data[rev(order(mean.data$utteranceType)),]

bar.heights = matrix(mean.data$response, nrow=2, byrow=T,
                     dimnames=list(distribution=c("low", "high"),target=c("none", "generic")))
bar.ub = matrix(mean.data$higher, nrow=2, byrow=T,
                dimnames=list(training=c("low", "high"),target=c("none", "generic")))
bar.lb = matrix(mean.data$lower, nrow=2, byrow=T,
                dimnames=list(training=c("low", "high"),target=c("none", "generic")))

bar = barplot(bar.heights, beside=T, legend.text=T,
              col=c("darkblue", "darkcyan"), xlab="distributions",
              ylim=c(0,1), main="will the first wug have fur?",
              ylab='likelihood that first wug has fur',
              args.legend=list(x="topleft",
                               xjust=0))
error.bar(bar, bar.heights, bar.ub, bar.lb)