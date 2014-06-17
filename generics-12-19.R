library(rjson)

rdata = read.table("~/CoCoLab/generics/generics1.results", sep="\t", header=T, colClasses=c("factor", "factor", "factor", "numeric", "character"))
rdata = rdata[rdata$subj != "repeat",]
#rdata = rdata[rdata$qNum == 0,]
rdata = rdata[rdata$subj != "177",]
#rdata = rdata[as.numeric(as.character(rdata$subj)) < 160,]
#rdata$qNum = factor(rdata$qNum, ordered=T)
#rdata = rdata[rdata$domain != "flower",] #spots are hard to see
rdata = rdata[names(rdata)[names(rdata) != "comments"]]

# keep = c()
# for (s in unique(rdata$subj)) {
#   d = rdata[rdata$subj == s,]
#   num = as.numeric(as.character(d$qNum))
#   if (num[d$utteranceType == "none" & d$distribution == "low"] <
#         (num[d$utteranceType == "generic" & d$distribution == "low"][1])
#       & num[d$utteranceType == "none" & d$distribution == "low"] <
#         (num[d$utteranceType == "neg" & d$distribution == "low"][1])
#       ) {
#     keep = c(keep,T,T,T,T,T,T)
#   } else {
#     keep = c(keep,F,F,F,F,F,F)
#   }
# }
# rdata$keep = keep
# rdata = rdata[rdata$keep,]

this.dist.before = c()
generic.before = c()
neg.before = c()
utterance.before = c()
for (s in unique(rdata$subj)) {
  d = rdata[rdata$subj == s,]
  num = as.numeric(as.character(d$qNum))
  for (i in 1:nrow(d)) {
    qnum = d$qNum[i]
    this.dist = d$distribution[i]
    if (min(num[d$distribution == this.dist]) < qnum) {
      this.dist.before = c(this.dist.before, T)
    } else {
      this.dist.before = c(this.dist.before, F)
    }
    if (min(num[d$utteranceType == "generic"]) < qnum) {
      generic.before = c(generic.before, T)
    } else {
      generic.before = c(generic.before, F)
    }
    if (min(num[d$utteranceType == "neg"]) < qnum) {
      neg.before = c(neg.before, T)
    } else {
      neg.before = c(neg.before, F)
    }
    if (min(c(num[d$utteranceType == "neg"], num[d$utteranceType == "generic"])) < qnum) {
      utterance.before = c(utterance.before, T)
    } else {
      utterance.before = c(utterance.before, F)
    }
  }
}
rdata$this.dist.before = this.dist.before
rdata$generic.before = generic.before
rdata$neg.before = neg.before
rdata$utterance.before = utterance.before

####compare low-none to low-generic
tiny.data = rdata[rdata$distribution == "low" & (rdata$utteranceType == "generic" | rdata$utteranceType == "none"),]
fit = lm(response~utteranceType, data=tiny.data)
print(anova(fit))
# 
####is the lowering of the low-none condition a result of seeing the distribution or the utterance?
tiny.data = rdata[rdata$distribution == "low" & rdata$utteranceType == "none",]
fit = lm(response~this.dist.before*utterance.before, data=tiny.data)
print(anova(fit))

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

mean.data = mean.data[order(mean.data$utteranceType),]
mean.data = mean.data[rev(order(mean.data$distribution)),]

# bar.heights = matrix(mean.data$response, nrow=2, byrow=T,
#                      dimnames=list(distribution=c("low", "high"),target=c("none", "generic")))
# bar.ub = matrix(mean.data$higher, nrow=2, byrow=T,
#                 dimnames=list(training=c("low", "high"),target=c("none", "generic")))
# bar.lb = matrix(mean.data$lower, nrow=2, byrow=T,
#                 dimnames=list(training=c("low", "high"),target=c("none", "generic")))
# 
# bar = barplot(t(bar.heights), beside=T, legend.text=T,
#               col=c("darkblue", "cyan"), xlab="distributions",
#               ylim=c(0,1), main="will the first wug have fur?",
#               ylab='likelihood that first wug has fur',
#               args.legend=list(x="topleft",
#                                xjust=0))

bar.heights = matrix(mean.data$response, nrow=2, byrow=T,
                     dimnames=list(distribution=c("low", "high"),target=c("none", "negative", "generic")))
bar.ub = matrix(mean.data$higher, nrow=2, byrow=T,
                dimnames=list(training=c("low", "high"),target=c("none", "negative", "generic")))
bar.lb = matrix(mean.data$lower, nrow=2, byrow=T,
                dimnames=list(training=c("low", "high"),target=c("none", "negative", "generic")))

bar = barplot(t(bar.heights), beside=T, legend.text=T,
              col=c("darkblue", "darkcyan", "cyan"), xlab="distributions",
              ylim=c(0,1), main="will the first wug have fur?",
              ylab='likelihood that first wug has fur',
              args.legend=list(x="topleft",
                               xjust=0))

error.bar(bar, t(bar.heights), t(bar.ub), t(bar.lb))


# #rdata$cond
# before.neg = "before"
# cond = c()
# for (i in 1:nrow(rdata)) {
#   if (rdata$utteranceType[i] == "neg") {
#     before.neg = "after"
#   }
#   cond = c(cond, before.neg)
#   if (rdata$qNum[i] == 5) {
#     before.neg = "before"
#   }
# }
# rdata$cond = as.factor(cond)

# rdata = rdata[rdata$utteranceType != "neg" & rdata$distribution == "low",]
# 
# mean.data = conf.mean("response", c("cond", "utteranceType"), rdata)
# 
# fit = lm(response~cond*utteranceType, data=rdata)
# print(anova(fit))
# 
# mean.data = mean.data[order(mean.data$utteranceType),]
# mean.data = mean.data[rev(order(mean.data$cond)),]
# 
# bar.heights = matrix(mean.data$response, nrow=2, byrow=T,
#                      dimnames=list(cond=c("before", "after"),target=c("none", "generic")))
# bar.ub = matrix(mean.data$higher, nrow=2, byrow=T,
#                 dimnames=list(training=c("before", "after"),target=c("none", "generic")))
# bar.lb = matrix(mean.data$lower, nrow=2, byrow=T,
#                 dimnames=list(training=c("before", "after"),target=c("none", "generic")))
# 
# bar = barplot(t(bar.heights), beside=T, legend.text=T,
#               col=c("darkblue", "cyan"), xlab="before or after negative utterance",
#               ylim=c(0,1), main="will the first wug have fur?",
#               ylab='likelihood that first wug has fur',
#               args.legend=list(x="topleft",
#                                xjust=0))
# error.bar(bar, t(bar.heights), t(bar.ub), t(bar.lb))


# rdata = rdata[rdata$utteranceType != "neg" & rdata$distribution == "low" & rdata$utteranceType == "none",]
# mean.data = conf.mean("response", c("cond"), rdata)
# 
# fit = lm(response~cond, data=rdata)
# print(anova(fit))
# 
# mean.data = mean.data[rev(order(mean.data$cond)),]
# 
# bar = barplot(mean.data$response, legend.text=T,
#               col="darkblue",
#               xlab="before or after negative utterance",
#               ylim=c(0,1), main="will the first wug have fur? - none",
#               ylab='likelihood that first wug has fur',
#               args.legend=list(x="topleft",
#                                xjust=0))
# 
# error.bar(bar, mean.data$response, mean.data$higher, mean.data$lower)
# 
# 
# ### trial numbers
# rdata = rdata[rdata$utteranceType != "neg" & rdata$distribution == "low",]
# 
# fit = lm(response~qNum*utteranceType, data=rdata)
# print(anova(fit))
# 
# mean.data = conf.mean("response", c("qNum", "utteranceType"), rdata)
# mean.data = mean.data[rev(order(as.numeric(as.character(mean.data$qNum)))),]
# mean.data = mean.data[rev(order(mean.data$utteranceType)),]
# 
# bar.heights = matrix(mean.data$response, ncol=2, byrow=F,
#                      dimnames=list(qNum=c("0", "1", "2", "3", "4", "5"),
#                                    utterance=c("none", "generic")))
# bar.ub = matrix(mean.data$higher, ncol=2, byrow=F,
#                      dimnames=list(qNum=c("0", "1", "2", "3", "4", "5"),
#                                    utterance=c("none", "generic")))
# bar.lb = matrix(mean.data$lower, ncol=2, byrow=F,
#                      dimnames=list(qNum=c("0", "1", "2", "3", "4", "5"),
#                                    utterance=c("none", "generic")))
# 
# bar = barplot(bar.heights, legend.text=T, beside=T,
#               col=rainbow(6),
#               xlab="utterance",
#               ylim=c(0,1), main="will the first wug have fur? - low prior",
#               ylab='likelihood that first wug has fur',
#               args.legend=list(x="topleft",
#                                xjust=0,
#                                title="trial#"))
# 
# error.bar(bar, mean.data$response, mean.data$higher, mean.data$lower)




# #rdata$half
# rdata$half = as.factor(sapply(rdata$qNum, function(q) {
#   if (q>1) {
#     "second"
#   } else {
#     "first"
#   }
# }))
# 
# rdata = rdata[rdata$utteranceType != "neg" & rdata$distribution == "low",]
# 
# mean.data = conf.mean("response", c("half", "utteranceType"), rdata)
# 
# fit = lm(response~half*utteranceType, data=rdata)
# print(anova(fit))
# 
# mean.data = mean.data[rev(order(mean.data$utteranceType)),]
# mean.data = mean.data[order(mean.data$half),]
# 
# bar.heights = matrix(mean.data$response, nrow=2, byrow=T,
#                      dimnames=list(cond=c("first", "second"),target=c("none", "generic")))
# bar.ub = matrix(mean.data$higher, nrow=2, byrow=T,
#                 dimnames=list(training=c("first", "second"),target=c("none", "generic")))
# bar.lb = matrix(mean.data$lower, nrow=2, byrow=T,
#                 dimnames=list(training=c("first", "second"),target=c("none", "generic")))
# 
# bar = barplot(t(bar.heights), beside=T, legend.text=T,
#               col=c("darkblue", "cyan"), xlab="first or second half of experiment",
#               ylim=c(0,1), main="will the first wug have fur?",
#               ylab='likelihood that first wug has fur',
#               args.legend=list(x="topleft",
#                                xjust=0))
# error.bar(bar, t(bar.heights), t(bar.ub), t(bar.lb))
# 
# 
# 
# 
# 
# ####compare low-none to low-generic
# tiny.data = rdata[rdata$distribution == "low" & (rdata$utteranceType == "generic" | rdata$utteranceType == "none"),]
# fit = lm(response~utteranceType, data=tiny.data)
# print(anova(fit))