import json
import re

f1 = open("generics.results", "r")
f2 = open("generics-erin.results", "r")
f3 = open("generics-erin2.results", "r")
f4 = open("generics-simpler.results", "r")
w = open("clean-generics.results", "w")
w.write("\t".join(["subj", #"comments",
	               "age", "language", "distribution", "utteranceType", "domain", "property",
	               "qNum", "qType", "responses"]))#, "lowers", "uppers", "nPositiveExamples"]))
w.close()
w = open("clean-generics.results", "a")
header = []

sep = "\t"

subjNums = {}
def subjNum(elem):
	if not elem in subjNums.keys():
		subjNums[elem] = str(len(subjNums))
	else:
		print "repeat"
	return subjNums[elem]

def cutFirstAndLast(x, i=1, j=1):
	return x[i:(len(x)-j)]

def tameQuotes(x):
	return re.sub("\"+", "\"", x)

for f in [f1, f2, f3, f4]:
	firstLine = True
	for line in f:
		row = line[:-1].split(sep)

		# data per subject:
		subj = ""
		comments = ""
		age = ""
		language = ""
		distribution = ""
		utteranceType = ""
		domain = ""
		prop = ""
		qNums = []
		qTypes = []
		responseLists = []
		lowerLists = []
		upperLists = []
		positiveExamplesNums = []
		domains = []
		props = []
		utteranceTypes = []

		# get subj data from csv:
		if firstLine:
			header = map(cutFirstAndLast, row)
			firstLine = False
		else:
			for i in range(len(row)):
				heading = header[i]
				elem = row[i]
				if heading == "workerid":
					subj = subjNum(elem) #SUBJECT NUMBER
				elif heading == "Answer.comments":
					comments = cutFirstAndLast(elem,2,2) #COMMENTS
				elif heading in map(lambda x: "Answer.trial"+str(x), range(0,20)) and len(elem)>0:
					qNum = int(heading.split("trial")[1])
					qNums.append("q" + str(qNum)) #QUESTION NUMBER (ORDERING)
					qData = json.loads(tameQuotes(cutFirstAndLast(elem)))
					qType = qData["qType"]
					qTypes.append(qType) #QUESTION TYPE (MAX OR PROB)
					if qType == "target":
						lowers = "[" + ",".join(map( str, qData["lowers"])) + "]"
						uppers = re.sub("infty", "-1", "[" + ",".join(map (str, qData["uppers"])) + "]")
						responses = "[" + ",".join(map (str, qData["responses"])) + "]"
						positiveExamplesNum = ""
						if ("nPositiveExamples" in qData.keys()):
							positiveExamplesNum = str(qData["nPositiveExamples"])
						if ("distribution" in qData.keys()):
							positiveExamplesNum = str(qData["distribution"])
					else:
						positiveExamplesNum = str(qData["nPositiveExamples"])
						responses = ""
						lowers = ""
						uppers = ""
					if ("domain" in qData.keys()):
						domains.append(qData["domain"])
					if ("property" in qData.keys()):
						props.append(qData["property"])
					if ("utteranceType" in qData.keys()):
						utteranceTypes.append(qData["utteranceType"])
					responseLists.append(responses)
					lowerLists.append(lowers)
					upperLists.append(uppers)
					positiveExamplesNums.append(positiveExamplesNum)
				elif heading == "Answer.age":
					age = cutFirstAndLast(elem, 3, 3)
				elif heading == "Answer.language":
					language = cutFirstAndLast(elem,3,3)
				elif heading == "Answer.distribution":
					distribution = cutFirstAndLast(elem,3,3)
				elif heading == "Answer.utteranceType":
					utteranceType = cutFirstAndLast(elem,3,3)
				elif heading == "Answer.domain":
					domain = cutFirstAndLast(elem,3,3)
				elif heading == "Answer.property":
					prop = cutFirstAndLast(elem, 3, 3)
				elif heading == "language":
					language = cutFirstAndLast(elem)

		# print long form for subj data:
		for i in range(len(qNums)):
			w.write("\n")
			if len(domains) > 0:
				new_row = "\t".join([subj, #comments, 
					                 age, language] +
					                map(lambda x: x[i],
					                	[positiveExamplesNums, utteranceTypes, domains, props, qNums, qTypes, responseLists]))
			else:
				new_row = "\t".join([subj, #comments,
					                age, language, distribution, utteranceType, domain, prop] +
					                map(lambda x: x[i],
					                	[qNums, qTypes, responseLists]))#, lowerLists, upperLists, positiveExamplesNums]))
			# w.write("\t".join(["subj", "comments", "age", "language", "distribution", "utteranceType", "domain", "property"
	  #              "qNum", "qType", "responses", "lowers", "uppers"]))
			w.write(new_row)
	f.close()
w.close()
