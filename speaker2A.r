library("ggplot2")
library("bear")

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

df$response = as.numeric(as.character(df$response))

df = ddply(df, .(workerid, trial_type, category_type), transform, normed_response = response / sum(response))

# ratings = subset(df, trial_type == "speaker_ratings")
# ratings$response = as.numeric(as.character(ratings$response))
# ratings_summary = summarySE(ratings, measurevar="response", groupvars=c("context", "sentence_type", "category", "amount_positive_examples"))
# ratings_summary$context = factor(ratings_summary$context, levels=c("higher", "same", #"a_bit_lower",
#                                                                    "lower"))
# 
# target_generic = subset(ratings_summary, category == "target" & sentence_type == "generic")
# ggplot(target_generic, aes(x=context, y=response, fill=context)) +
#   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
#   #facet_wrap(~ category) +
#   #theme_bw(24) +
#   ggtitle("endorsement of generic for target items (50%)") +
#   geom_errorbar(aes(ymin=response-ci, ymax=response+ci), width=.1, position=position_dodge(.9))
# ggsave(file="target-generic.pdf", width=10, height=6)
# 
# distractor_generic = subset(ratings_summary, category == "context" & sentence_type == "generic")
# ggplot(distractor_generic, aes(x=amount_positive_examples, y=response, fill=amount_positive_examples)) +
#   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
#   ggtitle("endorsement of generic for distractor items") +
#   geom_errorbar(aes(ymin=response-ci, ymax=response+ci), width=.1, position=position_dodge(.9))
# ggsave(file="distractor-generic.pdf", width=10, height=6)
# 
# ######normalize responses
# 
# nr = subset(df, trial_type == "speaker_ratings")
# nr$response = as.numeric(nr$response)
# nr = ddply(nr, .(workerid), transform, normed_response = response / sum(response))
# nr_summary = summarySE(nr, measurevar="normed_response", groupvars=c("context", "sentence_type", "category", "amount_positive_examples"))
# nr_summary$context = factor(nr_summary$context, levels=c("higher", "same", #"a_bit_lower",
#                                                          "lower"))
# 
# ntg = subset(nr_summary, category == "target" & sentence_type == "generic")
# ggplot(ntg, aes(x=context, y=normed_response, fill=context)) +
#   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
#   #facet_wrap(~ category) +
#   #theme_bw(24) +
#   ggtitle("endorsement of generic for target items (50%) (normalized ratings)") +
#   geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci), width=.1, position=position_dodge(.9))
# ggsave(file="normalized-target-generic.pdf", width=10, height=6)
# 
# ndg = subset(nr_summary, category == "context" & sentence_type == "generic")
# ggplot(ndg, aes(x=amount_positive_examples, y=normed_response, fill=amount_positive_examples)) +
#   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
#   ggtitle("endorsement of generic for distractor items") +
#   geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci), width=.1, position=position_dodge(.9))
# ggsave(file="normalized-distractor-generic.pdf", width=10, height=6)
# 
# print("number of subjects in each context condition:")
# print(paste("higher", length(unique(df$workerid[df$context == "higher"]))))
# print(paste("same", length(unique(df$workerid[df$context == "same"]))))
# print(paste("a_bit_lower", length(unique(df$workerid[df$context == "a_bit_lower"]))))
# print(paste("lower", length(unique(df$workerid[df$context == "lower"]))))
# 
# # normed_response_generic_target = subset(nr, category_type == "target" & sentence_type == "generic")
# # normed_response_generic_target_fit = lm(normed_response ~ context, data=normed_response_generic_target)
# # print(anova(normed_response_generic_target_fit))
# # response_generic_target = subset(ratings, category_type == "target" & sentence_type == "generic")
# # response_generic_target_fit = lm(response ~ context, data=normed_response_generic_target)
# # print(anova(response_generic_target_fit))
# # 
# # normed_response_generic_distractor = subset(nr, category == "context" & sentence_type == "generic")
# # normed_response_generic_distractor_fit = lm(normed_response ~ amount_positive_examples, data=normed_response_generic_distractor)
# # print(anova(normed_response_generic_distractor_fit))
# # response_generic_distractor = subset(ratings, category == "context" & sentence_type == "generic")
# # response_generic_distractor_fit = lm(response ~ amount_positive_examples, data=response_generic_distractor)
# # print(anova(response_generic_distractor_fit))
# # 
# # posterior = subset(df, trial_type=="posterior_predictive")
# # posterior$response = as.numeric(as.character(posterior$response))
# # posterior_summary = summarySE(posterior, measurevar="response", groupvars=c("context", "category", "amount_positive_examples"))
# # posterior_target_fit = lm(response ~ context, data=subset(posterior, category == "target"))
# # print(anova(posterior_target_fit))
# # posterior_distractor_fit = lm(response ~ context, data=subset(posterior, category == "context"))
# # print(anova(posterior_distractor_fit))
# # ggplot(subset(posterior_summary, category=="target"), aes(x=context, y=response, fill=context)) +
# #   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
# #   ggtitle("posterior predictive measure for target category given generic") +
# #   geom_errorbar(aes(ymin=response-ci, ymax=response+ci), width=.1, position=position_dodge(.9))
# # ggsave(file="posterior-target-generic.pdf", width=10, height=6)
# # ggplot(subset(posterior_summary, category=="context"), aes(x=amount_positive_examples, y=response, fill=amount_positive_examples)) +
# #   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
# #   ggtitle("posterior predictive measure for distractor category given generic") +
# #   geom_errorbar(aes(ymin=response-ci, ymax=response+ci), width=.1, position=position_dodge(.9))
# # ggsave(file="posterior-distractor-generic.pdf", width=10, height=6)
# 
# target = subset(ratings_summary, category == "target")
# ggplot(target, aes(x=context, y=response, fill=context)) +
#   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
#   facet_wrap(~ sentence_type) +
#   #theme_bw(24) +
#   ggtitle("endorsement of sentences for target items (50%)") +
#   geom_errorbar(aes(ymin=response-ci, ymax=response+ci), width=.1, position=position_dodge(.9))
# ggsave(file="target.pdf", width=10, height=6)
# 
# distractor = subset(ratings_summary, category == "context")
# ggplot(distractor, aes(x=amount_positive_examples, y=response, fill=amount_positive_examples)) +
#   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
#   ggtitle("endorsement of sentences for distractor items") +
#   facet_wrap(~ sentence_type) +
#   geom_errorbar(aes(ymin=response-ci, ymax=response+ci), width=.1, position=position_dodge(.9))
# ggsave(file="distractor.pdf", width=10, height=6)
# 
# normed_target = subset(nr_summary, category == "target")
# ggplot(normed_target, aes(x=context, y=normed_response, fill=context)) +
#   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
#   facet_wrap(~ sentence_type) +
#   #theme_bw(24) +
#   ggtitle("endorsement of sentences for target items (50%) (normalized)") +
#   geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci), width=.1, position=position_dodge(.9))
# ggsave(file="normed_target.pdf", width=10, height=6)
# 
# normed_distractor = subset(nr_summary, category == "context")
# ggplot(normed_distractor, aes(x=amount_positive_examples, y=normed_response, fill=amount_positive_examples)) +
#   geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
#   ggtitle("endorsement of sentences for distractor items (normalized)") +
#   facet_wrap(~ sentence_type) +
# geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci), width=.1, position=position_dodge(.9))
# ggsave(file="normed_distractor.pdf", width=10, height=6)
# 
# 
# individual_target = subset(df, category=="target" & trial_type == "speaker_ratings")
# individual_target$sentence_type = factor(individual_target$sentence_type, levels=c("negation", "sometimes", "usually", "generic", "always"))
# ggplot(individual_target, aes(x=sentence_type, y=response, colour=sentence_type)) +
#   geom_point(aes(shape=context), stat="identity", size=4) +
#   ggtitle("individual subject endorsement per sentence for target (50%)") +
#   facet_wrap(~ workerid)
# ggsave(file="individuals_target.pdf", width=20, height=12)
# 
# individual_context = subset(df, category=="context" & trial_type == "speaker_ratings")
# individual_context$sentence_type = factor(individual_context$sentence_type, levels=c("negation", "sometimes", "usually", "generic", "always"))
# ggplot(individual_context, aes(x=sentence_type, y=response, colour=sentence_type)) +
#   geom_point(aes(shape=amount_positive_examples), stat="identity", size=4) +
#   ggtitle("individual subject endorsement per sentence for distractor") +
#   facet_wrap(~ workerid)
# ggsave(file="individuals_context.pdf", width=20, height=12)
# 
# individual_target = subset(df, category=="target" & trial_type == "speaker_ratings")
# individual_target$sentence_type = factor(individual_target$sentence_type, levels=c("negation", "sometimes", "usually", "generic", "always"))
# individual_target$context = factor(individual_target$context, levels=c("higher", "same", "a_bit_lower", "lower"))
# #individual_target$workerid = as.factor(individual_target$workerid)
# ggplot(individual_target, aes(x=sentence_type, y=response)) +
#   geom_line(aes(x=sentence_type, y=response, group=workerid), alpha=1/10) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=3) +
#   ggtitle("individual subject endorsement per sentence for target (50%)") +
#   facet_wrap(~ context)
# ggsave(file="individuals_target_view2.pdf", width=20, height=8)
# 
# individual_context = subset(df, category=="context" & trial_type == "speaker_ratings")
# individual_context$sentence_type = factor(individual_context$sentence_type, levels=c("negation", "sometimes", "usually", "generic", "always"))
# individual_context$amount_positive_examples = factor(individual_context$amount_positive_examples, levels=c("few", "three", "half", "most"))
# #individual_target$workerid = as.factor(individual_target$workerid)
# ggplot(individual_context, aes(x=sentence_type, y=response)) +
#   geom_line(aes(x=sentence_type, y=response, group=workerid), alpha=1/10) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=3) +
#   ggtitle("individual subject endorsement per sentence for distractor (10-90%)") +
#   facet_wrap(~ amount_positive_examples)
# ggsave(file="individuals_context_view2.pdf", width=20, height=8)

individuals = subset(df, trial_type == "speaker_ratings")
individuals$category = factor(individuals$category, levels=c("target", "context"), labels=c("target (percent positive=50%)", "distractor (percent positive=context)"))
#individuals$context = factor(individuals$context, levels=c("lower", "a_bit_lower", "same", "higher"), labels=c("context=10%", "context=30%", "context=50%", "context=90%"))
individuals$context = factor(individuals$context, levels=c("lower", "a_bit_lower", "same", "higher"), labels=c("10", "30", "50", "90"))
individuals$numeric_context = as.numeric(as.character(individuals$context))
individuals$sentence_type = factor(individuals$sentence_type, levels=c("generic", "usually", "negation", "sometimes", "always"))

###### trial type: sentence ratings (speaker dependent measure)

# # messy graph of individual data with lines linking responses
# ggplot(individuals, aes(x=sentence_type, y=response)) +
#   geom_line(aes(x=sentence_type, y=response, group=workerid), alpha=1/10) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=3) +
#   ggtitle("individual subject endorsement per sentence ") +
#   facet_grid(category ~ context)
# ggsave(file="individuals.pdf", width=20, height=12, title="individuals")
# 
# # cleaner graph of mean data with 95% confidence intervals
# sentence_summary = summarySE(individuals, measurevar="response", groupvars=c("context", "sentence_type", "category"))
# ggplot(sentence_summary, aes(x=sentence_type, y=response)) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=3) +
#   ggtitle("mean endorsement per sentence ") +
#   geom_errorbar(aes(ymin=response-ci, ymax=response+ci, colour=sentence_type), width=.1) +
#   facet_grid(category ~ context)
# ggsave(file="mean_responses.pdf", width=20, height=12, title="mean_responses")
# 
# #cleaner graph with mean of normalized data
# normed_sentence_summary = summarySE(individuals, measurevar="normed_response", groupvars=c("context", "sentence_type", "category"))
# ggplot(normed_sentence_summary, aes(x=sentence_type, y=normed_response)) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=3) +
#   ggtitle("mean endorsement per sentence ") +
#   geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci, colour=sentence_type), width=.1) +
#   facet_grid(category ~ context)
# ggsave(file="normed_mean_responses.pdf", width=20, height=12, title="normed_mean_responses")

# # messy graph with normalized individual data
# ggplot(individuals, aes(x=sentence_type, y=normed_response)) +
#   geom_line(aes(x=sentence_type, y=normed_response, group=workerid), alpha=1/10) +
#   geom_point(aes(colour=factor(sentence_type)), stat="identity", size=3) +
#   ggtitle("individual subject endorsement per sentence ") +
#   facet_grid(category ~ context)
# ggsave(file="normed_individuals.pdf", width=20, height=12, title="normed_individuals")

point_size = 8

# better x and y axis choices for messy graph with normalized individual data
ggplot(individuals, aes(x=numeric_context, y=normed_response)) +
  geom_point(aes(colour=factor(sentence_type)), stat="identity", size=point_size, alpha=1/4) +
  ggtitle("normalized individual subject endorsement per sentence") +
  facet_grid(category ~ sentence_type) +
  theme_bw(18) +
  theme(
    plot.background = element_blank()
    #,panel.grid.major = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file="normed_individuals.pdf", width=20, height=10, title="normed_individuals")

# better x and y axis choices for cleaner graph with mean of normalized data
normed_sentence_summary = summarySE(individuals, measurevar="normed_response", groupvars=c("numeric_context", "sentence_type", "category"))
ggplot(normed_sentence_summary, aes(x=numeric_context, y=normed_response)) +
  geom_point(aes(colour=factor(sentence_type)), stat="identity", size=point_size) +
  ggtitle("mean of normalized endorsement per sentence ") +
  geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci, colour=sentence_type), width=1) +
  facet_grid(category ~ sentence_type) +
  theme_bw(18) +
  theme(
    plot.background = element_blank()
    #,panel.grid.major = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file="normed_mean_responses.pdf", width=20, height=10, title="normed_mean_responses")

# better x and y axis choices for messy graph with normalized individual data
ggplot(individuals, aes(x=numeric_context, y=response)) +
  geom_point(aes(colour=factor(sentence_type)), stat="identity", size=point_size, alpha=1/4) +
  ggtitle("unnormalized individual subject endorsement per sentence") +
  facet_grid(category ~ sentence_type) +
  theme_bw(18) +
  theme(
    plot.background = element_blank()
    #,panel.grid.major = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file="unnormed_individuals.pdf", width=20, height=10, title="unnormed_individuals")

# better x and y axis choices for cleaner graph with mean of normalized data
normed_sentence_summary = summarySE(individuals, measurevar="response", groupvars=c("numeric_context", "sentence_type", "category"))
ggplot(normed_sentence_summary, aes(x=numeric_context, y=response)) +
  geom_point(aes(colour=factor(sentence_type)), stat="identity", size=point_size) +
  ggtitle("mean of unnormalized endorsement per sentence ") +
  geom_errorbar(aes(ymin=response-ci, ymax=response+ci, colour=sentence_type), width=1) +
  facet_grid(category ~ sentence_type) +
  theme_bw(18) +
  theme(
    plot.background = element_blank()
    #,panel.grid.major = element_blank()
    ,panel.grid.minor = element_blank()
  )
ggsave(file="unnormed_mean_responses.pdf", width=20, height=10, title="unnormed_mean_responses")

###### trial type: posterior predictive measure