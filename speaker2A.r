library("ggplot2")
library("bear")
library("plyr")

df = read.table("speaker2A.csv", sep="\t", header=T)
df = df[,c("reminder_target", "posterior_order", "comments",
           "context", "creature", "category_type",
           "workerid", "language", "age", "reminder_context_category1",
           "speaker_order", "duration", "amount_positive_examples",
           "response", "target_property", "presentation_order",
           "reminder_context_category0", "end_time", "start_time",
           "trial_type", "sentence_type")]
#df = subset(df, context != "a_bit_lower")
# df = subset(df, reminder_target == "True")
# df = subset(df, reminder_context_category0 == "True")
# df = subset(df, reminder_context_category1 == "True")

df$category = as.character(df$category_type)
df$category[df$category == "context_category0"] = "context"
df$category[df$category == "context_category1"] = "context"
df$category = as.factor(df$category)

df$category = factor(df$category, levels=c("target", "context"), labels=c("target (percent positive=50%)", "distractor (percent positive=context)"))
df$context = factor(df$context, levels=c("lower", "a_bit_lower", "same", "higher"), labels=c("10", "30", "50", "90"))
df$numeric_context = as.numeric(as.character(df$context))

###### name check: how did Ss echo back the names of the creatures

name_check = subset(df, trial_type=="name_attention_check")
name_check$response = as.character(name_check$response)

###### trial type: sentence ratings (speaker dependent measure)

point_size = 5

speaker_measure = subset(df, trial_type == "speaker_ratings")
speaker_measure$response = as.numeric(as.character(speaker_measure$response))
speaker_measure = ddply(speaker_measure, .(workerid, category_type), transform, normed_response = response / sum(response))
speaker_measure$sentence_type = factor(speaker_measure$sentence_type, levels=c("generic", "usually", "negation", "sometimes", "always"))

# # better x and y axis choices for messy graph with normalized individual data
# ggplot(individuals, aes(x=numeric_context, y=normed_response)) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=point_size, alpha=1/4) +
#   ggtitle("normalized individual subject endorsement per sentence") +
#   facet_grid(category ~ sentence_type) +
#   theme_bw(18) +
#   theme(
#     plot.background = element_blank()
#     #,panel.grid.major = element_blank()
#     ,panel.grid.minor = element_blank()
#   )
# ggsave(file="normed_individuals.pdf", width=20, height=10, title="normed_individuals")
# 
# # better x and y axis choices for cleaner graph with mean of normalized data
# normed_sentence_summary = summarySE(individuals, measurevar="normed_response", groupvars=c("numeric_context", "sentence_type", "category"))
# ggplot(normed_sentence_summary, aes(x=numeric_context, y=normed_response)) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=point_size) +
#   ggtitle("mean of normalized endorsement per sentence ") +
#   geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci, colour=sentence_type), width=1) +
#   facet_grid(category ~ sentence_type) +
#   theme_bw(18) +
#   theme(
#     plot.background = element_blank()
#     #,panel.grid.major = element_blank()
#     ,panel.grid.minor = element_blank()
#   )
# ggsave(file="normed_mean_responses.pdf", width=20, height=10, title="normed_mean_responses")

# # messy graph of individual data
# ggplot(speaker_measure, aes(x=numeric_context, y=response)) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=point_size, alpha=1/4) +
#   ggtitle("Individual Unnormalized Speaker Measure Responses") +
#   facet_grid(category ~ sentence_type) +
#   theme_bw(18) +
#   theme(
#     plot.background = element_blank()
#     #,panel.grid.major = element_blank()
#     ,panel.grid.minor = element_blank()
#   )
# ggsave(file="speaker_individual.pdf", width=20, height=10, title="Individual Unnormalized Speaker Measure Responses")
# 
# # messy graph of individual data, keeping track of individuals
# ggplot(speaker_measure, aes(x=sentence_type, y=response)) +
#   geom_line(aes(x=sentence_type, y=response, group=category), colour="black",
#             alpha=1/5) +
# #   + geom_point(colour="black", size = 4.5) +
# #   geom_point(colour="pink", size = 4) +
# #   geom_point(aes(shape = factor(cyl)))
#   geom_point(aes(shape=sentence_type, colour=context, solid=category),
#              stat="identity",
#              size=3) +
#   ggtitle("Individual Unnormalized Speaker Measure Responses") +
#   facet_wrap(~ workerid) +
#   theme(
#     plot.background = element_blank()
#     #,panel.grid.major = element_blank()
#     ,panel.grid.minor = element_blank()
#     #,legend.position="none"
#   )
# ggsave(file="speaker_by_subject.pdf", width=20, height=10, title="Individual Unnormalized Speaker Measure Responses")
# 
# # cleaner of mean data
speaker_measure = subset(speaker_measure, numeric_context != 30)
sentence_summary = summarySE(speaker_measure, measurevar="response", groupvars=c("numeric_context", "sentence_type", "category"))
# ggplot(sentence_summary, aes(x=numeric_context, y=response)) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=point_size) +
#   ggtitle("mean of unnormalized endorsement per sentence ") +
#   geom_errorbar(aes(ymin=response-ci, ymax=response+ci, colour=sentence_type), width=1) +
#   facet_grid(category ~ sentence_type) +
#   theme_bw(18) +
#   theme(
#     plot.background = element_blank()
#     #,panel.grid.major = element_blank()
#     ,panel.grid.minor = element_blank()
#   )
# ggsave(file="speaker_mean.pdf", width=20, height=10, title="Means of Unnormalized Speaker Measure Responses")
# 
# ###### trial type: posterior predictive measure
# 
# posterior_measure = subset(df, trial_type == "posterior_predictive")
# posterior_measure$response = as.numeric(as.character(posterior_measure$response))
# 
# ggplot(posterior_measure, aes(x=numeric_context, y=response)) +
#   geom_point(aes(colour=factor(numeric_context)), stat="identity", size=point_size, alpha=1/2) +
#   ggtitle("given 'wugs have fur', how likely is the next wug to have fur?") +
#   facet_wrap(~ category) +
#   theme_bw(18) +
#   theme(
#     plot.background = element_blank(),
#     panel.grid.minor = element_blank())
# ggsave(file="posterior_individual.pdf", width=16, height=8, title="Individual Posterior Measure Responses")
# 
# posterior_summary = summarySE(posterior_measure, measurevar="response", groupvars=c("numeric_context", "category"))
# ggplot(posterior_summary, aes(x=numeric_context, y=response)) +
#   geom_point(aes(colour=factor(numeric_context)), stat="identity", size=point_size) +
#   ggtitle("given 'wugs have fur', how likely is the next wug to have fur?") +
#   geom_errorbar(aes(ymin=response-ci, ymax=response+ci, colour=factor(numeric_context)), width=1) +
#   facet_wrap(~ category) +
#   theme_bw(18) +
#   theme(
#     plot.background = element_blank(),
#     panel.grid.minor = element_blank())
# ggsave(file="posterior_mean.pdf", width=16, height=8, title="Means of Posterior Measure Responses")

sentence_summary$target_proportion = rep(0, nrow(sentence_summary))
sentence_summary$target_proportion[sentence_summary$numeric_context == 10 & sentence_summary$category=="target (percent positive=50%)"] = 0.5
sentence_summary$target_proportion[sentence_summary$numeric_context == 10 & sentence_summary$category=="distractor (percent positive=context)"] = 0.1
sentence_summary$target_proportion[sentence_summary$numeric_context == 30 & sentence_summary$category=="target (percent positive=50%)"] = 0.5
sentence_summary$target_proportion[sentence_summary$numeric_context == 30 & sentence_summary$category=="distractor (percent positive=context)"] = 0.3
sentence_summary$target_proportion[sentence_summary$numeric_context == 50 & sentence_summary$category=="target (percent positive=50%)"] = 0.5
sentence_summary$target_proportion[sentence_summary$numeric_context == 50 & sentence_summary$category=="distractor (percent positive=context)"] = 0.5
sentence_summary$target_proportion[sentence_summary$numeric_context == 90 & sentence_summary$category=="target (percent positive=50%)"] = 0.5
sentence_summary$target_proportion[sentence_summary$numeric_context == 90 & sentence_summary$category=="distractor (percent positive=context)"] = 0.9
sentence_summary$distractor_proportion = rep(0, nrow(sentence_summary))
sentence_summary$distractor_proportion[sentence_summary$numeric_context == 10 & sentence_summary$category=="target (percent positive=50%)"] = 0.1
sentence_summary$distractor_proportion[sentence_summary$numeric_context == 10 & sentence_summary$category=="distractor (percent positive=context)"] = 0.5
sentence_summary$distractor_proportion[sentence_summary$numeric_context == 30 & sentence_summary$category=="target (percent positive=50%)"] = 0.3
sentence_summary$distractor_proportion[sentence_summary$numeric_context == 30 & sentence_summary$category=="distractor (percent positive=context)"] = 0.5
sentence_summary$distractor_proportion[sentence_summary$numeric_context == 50 & sentence_summary$category=="target (percent positive=50%)"] = 0.5
sentence_summary$distractor_proportion[sentence_summary$numeric_context == 50 & sentence_summary$category=="distractor (percent positive=context)"] = 0.5
sentence_summary$distractor_proportion[sentence_summary$numeric_context == 90 & sentence_summary$category=="target (percent positive=50%)"] = 0.9
sentence_summary$distractor_proportion[sentence_summary$numeric_context == 90 & sentence_summary$category=="distractor (percent positive=context)"] = 0.5
ggplot(sentence_summary, aes(x=distractor_proportion, y=response)) +
  geom_point(aes(colour=factor(target_proportion)), stat="identity", size=point_size) +
  geom_errorbar(aes(ymin=response-ci, ymax=response+ci, colour=factor(target_proportion)), width=.03) +
  ggtitle("2A Individual Unnormalized Speaker Measure Responses") +
  facet_grid(~sentence_type) +
  theme_bw(18) +
  theme(
    plot.background = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file="2A_mean.pdf", width=20, height=5, title="2A Individual Unnormalized Speaker Measure Responses")