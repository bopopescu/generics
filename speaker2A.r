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

df$category = as.character(df$category_type)
df$category[df$category == "context_category0"] = "context"
df$category[df$category == "context_category1"] = "context"
df$category = as.factor(df$category)

ratings = subset(df, trial_type == "speaker_ratings")
ratings$response = as.numeric(ratings$response)
ratings_summary = summarySE(ratings, measurevar="response", groupvars=c("context", "sentence_type", "category", "amount_positive_examples"))
ratings_summary$context = factor(ratings_summary$context, levels=c("higher", "same", "lower"))

target_generic = subset(ratings_summary, category == "target" & sentence_type == "generic")
ggplot(target_generic, aes(x=context, y=response, fill=context)) +
  geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
  #facet_wrap(~ category) +
  #theme_bw(24) +
  ggtitle("endorsement of generic for target items (50%)") +
  geom_errorbar(aes(ymin=response-ci, ymax=response+ci), width=.1, position=position_dodge(.9))
ggsave(file="target-generic.pdf", width=10, height=6)

distractor_generic = subset(ratings_summary, category == "context" & sentence_type == "generic")
ggplot(distractor_generic, aes(x=amount_positive_examples, y=response, fill=amount_positive_examples)) +
  geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
  ggtitle("endorsement of generic for distractor items") +
  geom_errorbar(aes(ymin=response-ci, ymax=response+ci), width=.1, position=position_dodge(.9))
ggsave(file="distractor-generic.pdf", width=10, height=6)

######normalize responses

nr = subset(df, trial_type == "speaker_ratings")
nr$response = as.numeric(nr$response)
nr = ddply(nr, .(workerid), transform, normed_response = response / sum(response))
nr_summary = summarySE(nr, measurevar="normed_response", groupvars=c("context", "sentence_type", "category", "amount_positive_examples"))
nr_summary$context = factor(nr_summary$context, levels=c("higher", "same", "lower"))

ntg = subset(nr_summary, category == "target" & sentence_type == "generic")
ggplot(ntg, aes(x=context, y=normed_response, fill=context)) +
  geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
  #facet_wrap(~ category) +
  #theme_bw(24) +
  ggtitle("endorsement of generic for target items (50%) (normalized ratings)") +
  geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci), width=.1, position=position_dodge(.9))
ggsave(file="normalized-target-generic.pdf", width=10, height=6)

ndg = subset(nr_summary, category == "context" & sentence_type == "generic")
ggplot(ndg, aes(x=amount_positive_examples, y=normed_response, fill=amount_positive_examples)) +
  geom_bar(position=position_dodge(.9), stat="identity", width=.9) +
  ggtitle("endorsement of generic for distractor items") +
  geom_errorbar(aes(ymin=normed_response-ci, ymax=normed_response+ci), width=.1, position=position_dodge(.9))
ggsave(file="normalized-distractor-generic.pdf", width=10, height=6)

print("number of subjects in each context condition:")
print(paste("higher", length(unique(df$workerid[df$context == "higher"]))))
print(paste("same", length(unique(df$workerid[df$context == "same"]))))
print(paste("lower", length(unique(df$workerid[df$context == "lower"]))))

normed_response_generic_target = subset(nr, category_type == "target" & sentence_type == "generic")
normed_response_generic_target_fit = lm(normed_response ~ context, data=normed_response_generic_target)
print(anova(normed_response_generic_target_fit))
response_generic_target = subset(ratings, category_type == "target" & sentence_type == "generic")
response_generic_target_fit = lm(response ~ context, data=normed_response_generic_target)
print(anova(response_generic_target_fit))

normed_response_generic_distractor = subset(nr, category == "context" & sentence_type == "generic")
normed_response_generic_distractor_fit = lm(normed_response ~ amount_positive_examples, data=normed_response_generic_distractor)
print(anova(normed_response_generic_distractor_fit))
response_generic_distractor = subset(ratings, category == "context" & sentence_type == "generic")
response_generic_distractor_fit = lm(response ~ amount_positive_examples, data=response_generic_distractor)
print(anova(response_generic_distractor_fit))
