library(ggplot2)
source("summarySE.r")
r = read.table("3a.tsv", sep="\t", header=T)
r = r[,c("workerid", "sentence", "response")]
r$sentence = factor(r$sentence, levels=c("Birds fly",
                                         "Mosquitos carry West Nile Virus",
                                         "Lions have manes",
                                         "Animals weigh less than 2 tons",
                                         "People have black hair",
                                         "People are over three years old",
                                         "People care about the environment",
                                         "Books are paperbacks",
                                         "Shoes are size 7 and above"))

s = summarySE(r, measurevar="response", groupvars=c("sentence"))
graph_title = "3a"
ggplot(s, aes(x=sentence, y=response)) +
  geom_bar(aes(fill=factor(sentence)), position=position_dodge(0.9), stat="identity") +
  geom_errorbar(aes(ymin=response-ci, ymax=response+ci, group=factor(sentence)), position=position_dodge(0.9), width=.3) +
  ggtitle(graph_title) +
  ylab("") +
  xlab("") +
  theme_bw(18) +
  theme(
    axis.text.x = element_text(size=10, angle=-45, hjust=0)
    ,plot.background = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file=paste(c(graph_title, ".png"), collapse=""), width=10, height=6, title=graph_title)

graph_title = "3a-dots"
ggplot(r, aes(x=sentence, y=response)) +
  geom_point(colour="black", size=3, alpha=1/3, stat="identity") +
  geom_line(aes(group=workerid, colour=factor(workerid)), alpha=1) +
  ggtitle(graph_title) +
  ylab("") +
  xlab("") +
  theme_bw(18) +
  theme(
    axis.text.x = element_text(size=10, angle=-45, hjust=0)
    ,legend.position="none"
    ,plot.background = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file=paste(c(graph_title, ".png"), collapse=""), width=10, height=6, title=graph_title)

r.z = ddply(r, .(workerid), transform, z.response = scale(response))
z = summarySE(r.z, measurevar="z.response", groupvars=c("sentence"))
graph_title = "3a-z"
ggplot(z, aes(x=sentence, y=z.response)) +
  geom_bar(aes(fill=factor(sentence)), position=position_dodge(0.9), stat="identity") +
  geom_errorbar(aes(ymin=z.response-ci, ymax=z.response+ci, group=factor(sentence)), position=position_dodge(0.9), width=.3) +
  ggtitle(graph_title) +
  ylab("") +
  xlab("") +
  theme_bw(18) +
  theme(
    axis.text.x = element_text(size=10, angle=-45, hjust=0)
    ,plot.background = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file=paste(c(graph_title, ".png"), collapse=""), width=10, height=6, title=graph_title)

r.z = ddply(r, .(workerid), transform, z.response = scale(response))
z = summarySE(r.z, measurevar="z.response", groupvars=c("sentence"))
graph_title = "3a-z-facet"
ggplot(z, aes(x=sentence, y=z.response)) +
  geom_bar(aes(fill=factor(sentence)), position=position_dodge(0.9), stat="identity") +
  geom_errorbar(aes(ymin=z.response-ci, ymax=z.response+ci, group=factor(sentence)), position=position_dodge(0.9), width=.3) +
  ggtitle(graph_title) +
  facet_wrap(~workerid) +
  ylab("") +
  xlab("") +
  theme_bw(18) +
  theme(
    axis.text.x = element_text(size=10, angle=-45, hjust=0)
    ,plot.background = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file=paste(c(graph_title, ".png"), collapse=""), width=10, height=6, title=graph_title)