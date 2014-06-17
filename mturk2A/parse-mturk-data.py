import sys
import csv
import json

mturk_data_file = sys.argv[1]
output_data_file = sys.argv[2]

workers = {}
def symb(workerid):
  if workerid in workers:
    return workers[workerid]
  else:
    id_number = str(len(workers))
    workers[workerid] = id_number
    return id_number

def get_column_labels(mturk_data_file):
  with open(mturk_data_file, 'rb') as csvfile:
    mturk_reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
    header = True
    header_labels = []
    mturk_labels = []
    trial_level_labels = set()
    subject_level_labels = set()
    for row in mturk_reader:
      if header:
        header = False
        header_labels = row
        mturk_labels = [h for h in header_labels if h[:7] != "Answer."]
      else:
        for i in range(len(row)):
          elem = row[i]
          label = header_labels[i]
          if label[:7] == "Answer.":
            elem = json.loads(elem)
            if type(elem) is int or type(elem) is bool or type(elem) is unicode:
              subject_level_labels.add(label[7:])
            elif type(elem) is list:
              for t in range(len(elem)):
                trial = elem[t]
                if type(trial) is dict:
                  trial_level_labels.update(trial.keys())
                else:
                  trial_level_labels.add("responseForTrial" + str(t))
            else:
              subject_level_labels.add(label[7:])
              #print "Warning 0: ignoring data: " + str(type(elem))
  return mturk_labels, list(subject_level_labels), list(trial_level_labels)

mturk_labels, subject_level_labels, trial_level_labels = get_column_labels(mturk_data_file)
column_labels = mturk_labels + subject_level_labels + trial_level_labels
output_lines = [column_labels]

with open(mturk_data_file, 'rb') as csvfile:
  mturk_reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
  header = True
  header_labels = []
  for row in mturk_reader:
    if header:
      header = False
      header_labels = row
    else:
      subject_data = {}
      for label in trial_level_labels:
        subject_data[label] = []
      for i in range(len(row)):
        elem = row[i]
        label = header_labels[i]
        if label == "workerid":
          elem = symb(elem)
          subject_data["workerid"] = elem
        elif label[:7] == "Answer.":
          elem = json.loads(elem)
          label = label[7:]
          if type(elem) is int or type(elem) is bool:
            subject_data[label] = str(elem)
          elif type(elem) is unicode:
            subject_data[label] = elem
          elif type(elem) is dict:
            subject_data[label] = str(elem)
          elif type(elem) is list:
            for trial in elem:
              for key in trial_level_labels:
                if type(trial) is dict:
                  if key in trial.keys():
                    if type(trial[key]) is int:
                      subject_data[key].append(str(trial[key]))
                    elif type(trial[key]) is unicode:
                      subject_data[key].append(str(trial[key]))
                    else:
                      subject_data[key].append(str(trial[key]))
                  else:
                    subject_data[key].append("NA")
                else:
                  subject_data[key].append(str(trial))
        else:
          subject_data[label] = elem
      if len(trial_level_labels) > 0:
        n_trials = len(subject_data[trial_level_labels[0]])
      else:
        n_trials = 1
      for i in range(n_trials):
        trial_line = []
        for label in mturk_labels:
          trial_line.append(subject_data[label])
        for label in subject_level_labels:
          trial_line.append(subject_data[label])
        for label in trial_level_labels:
          trial_line.append(subject_data[label][i])
        output_lines.append(trial_line)

print workers

w = open(output_data_file, 'w')
w.write("\n".join(["\t".join(x) for x in output_lines]))
w.close()