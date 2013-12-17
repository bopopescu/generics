library(rjson)

rdata = read.table("~/CoCoLab/generics/clean-generics.results", sep="\t", header=T)
rdata$responses = as.character(rdata$responses)
rdata = rdata[rdata$responses != "[0,0,0,0,0,0,0,0,0,0]",]
rdata$distribution = as.character(rdata$distribution)

for (out.of.ten in c(T,F)) {
  if (out.of.ten) {
    target.data = rdata[rdata$qType == "target" & as.numeric(as.character(rdata$subj))>65,]
  } else {
    target.data = rdata[rdata$qType == "target",]
  }
  #3 people took this study twice. need to address that, probably exclude the second time they took it
  
  # erin.data = rdata[(nrow(rdata)/2):nrow(rdata),]
  # target.data = erin.data[erin.data$qType == "target",]
  
  conf <- function(v, n) {
    v <- v[is.na(v) == F]
    sample.means <- replicate(100, mean(sample(v, n, replace=TRUE)))
    return(quantile(sample.means, c(0.025, 0.975)))
  }
  lower.conf <- function(v, n) {
    conf(v, n)[["2.5%"]]
  }
  higher.conf <- function(v, n) {
    conf(v, n)[["97.5%"]]
  }
  error.bar <- function(x, y, upper, lower=upper, lw=2, col="black", length=0.1,...){
    if(length(x) != length(y) | length(y) !=length(lower) | length(lower) != length(upper))
      stop("vectors must be same length")
    #arrows(x, upper, x, lower, angle=90, code=3, lwd=2, col=col, length=length, ...)
    segments(x, upper, x, lower, col=col, lw=lw, ...)
  }
  
  x = (1:10)*10-5
  for (normalize in c(T,F)) {
    for (individual in c(T,F)) {
      for (dist in c("2", "10", "18")) {
        if (normalize) {
          m = 0.45
        } else {
          m = 1
        }
        if (individual) {
          individual.label = "_with-individual-data"
        } else {
          individual.label = ""
        }
        if (normalize) {
          normalized.label = "_normalized"
        } else {
          normalized.label = ""
        }
        if (out.of.ten) {
          out.of.ten.label = "-out-of-ten"
        } else {
          out.of.ten.label = "-out-of-100"
        }
        png(paste(c("graphs/", dist, "examples", out.of.ten.label, normalized.label, individual.label, ".png"), 
                  collapse=""), 600, 400)
        color = list(none="red", generic="blue")
        lighter.color = list(none="lightpink", generic="lightblue")
        for (type in c("none", "generic")) {
          responses = lapply(target.data$responses[target.data$utteranceType == type &
                                                     target.data$distribution == dist],
                             function(responseList) {
                               raw.r = fromJSON(responseList)
                               if (normalize) {
                                 r = raw.r/sum(raw.r)
                                 ylim = NULL
                               } else {
                                 r = raw.r
                                 ylim = c(0,m)
                               }
                               if (individual) {
                                 plot(x, r, ylim=ylim,
                                      col=lighter.color[[type]], ylab="",
                                      xlab="", yaxt="n", xaxt="n", type="l")
                                 par(new=T)
                               }
                               return(r)
                             })
          mu = sapply(1:10, function(i) {
            return( mean(sapply(responses, function(r) {
              return(r[[i]])
            })))
          })
          ub = sapply(1:10, function(i) {
            return( higher.conf(sapply(responses, function(r) {
              return(r[[i]])
            }), length(responses)))
          })
          lb = sapply(1:10, function(i) {
            return( lower.conf(sapply(responses, function(r) {
              return(r[[i]])
            }), length(responses)))
          })
          plot(x, mu, main=paste(dist, "examples"), ylab="", ylim=c(0,m), type="o", col=color[[type]], xlab="bins")
          error.bar(x, mu, ub, lb, col=color[[type]])
          par(new=T)
        }
        legend("bottomleft", legend=c("none", "generic"), fill=c(color[["none"]], color[["generic"]]))
        par(new=F)
        dev.off()
      }
    }
  }
}