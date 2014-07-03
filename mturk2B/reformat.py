import sys
import csv
import json

mturk_data_file = "speaker2B.results"#sys.argv[1]
output_data_file_label = "speaker2B"#sys.argv[2]

def write_2_by_2(data, filename, sep="\t"):
  w = open(filename, "w")
  w.write("\n".join(map(lambda x: sep.join(x), data)))
  w.close()

workers = {}
def symb(workerid):
  if workerid in workers:
    return workers[workerid]
  else:
    id_number = str(len(workers))
    workers[workerid] = id_number
    return id_number

def get_column_labels(data_type):
  new_column_labels_from_json = set()
  with open(mturk_data_file, 'rb') as csvfile:
    header_labels = []
    header = True
    mturk_reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
    for row in mturk_reader:
      if header:
        header = False
        header_labels = row
        if data_type == "mturk":
          return [x for x in header_labels if (not x in ["Answer.trials", "Answer.subject_information", "Answer.check_trials", "Answer.system"])]
      else:
        for i in range(len(row)):
          elem = row[i]
          label = header_labels[i]
          if label == "Answer." + data_type:
            if label == "Answer.trials" or label == "Answer.check_trials":
              this_is_hacky = "{\"this_is_hacky\":" + elem + "}"
              trials = json.loads(this_is_hacky)["this_is_hacky"]
              for trial in trials:
                new_column_labels_from_json.update(trial.keys())
            elif label == "Answer.subject_information":
              data = json.loads(elem)
              new_column_labels_from_json.update(data.keys())
            elif label == "Answer.system":
              data = json.loads(elem)[0]
              new_column_labels_from_json.update(data.keys())
  return list(new_column_labels_from_json)

def make_tsv(data_type):
  new_column_labels = get_column_labels(data_type)
  mturk_output_column_names = []
  output_rows = [["workerid"] + new_column_labels]
  with open(mturk_data_file, 'rb') as csvfile:
    header_labels = []
    header = True
    mturk_reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
    for row in mturk_reader:
      if header:
        header = False
        header_labels = row
        mturk_output_column_names = [x for x in header_labels if (not x in ["Answer.trials", "Answer.subject_information", "Answer.check_trials", "Answer.system"])]
        #output_rows.append(output_column_names)
      else:
        subject_level_data = {}
        trial_level_data = {}
        for key in new_column_labels:
          trial_level_data[key] = []
        for i in range(len(row)):
          elem = row[i]
          label = header_labels[i]
          if label == "Answer." + data_type:
            if label == "Answer.trials" or label == "Answer.check_trials":
              this_is_hacky = "{\"this_is_hacky\":" + elem + "}"
              trials = json.loads(this_is_hacky)["this_is_hacky"]
              for trial in trials:
                for key in new_column_labels:
                  if key in trial.keys():
                    trial_level_data[key].append(str(trial[key]))
                  else:
                    trial_level_data[key].append("NA")
            else:
              if label == "Answer.subject_information":
                data = json.loads(elem)
              elif label == "Answer.system":
                data = json.loads(elem)[0]
              for key in new_column_labels:
                if key in data.keys():
                  subject_level_data[key] = str(data[key])
                else:
                  subject_level_data[key] = "NA"
          elif label == "workerid":
            elem = symb(elem)
            subject_level_data["workerid"] = elem
          else:
            subject_level_data[label] = str(elem)
        if len(trial_level_data.keys()) > 0:
          ntrials = len(trial_level_data[trial_level_data.keys()[0]])
        else:
          ntrials = 0
        if ntrials > 0:
          #print ntrials
          for i in range(ntrials):
            output_row = []
            # for key in mturk_output_column_names:
            #   output_row.append(subject_level_data[key])
            output_row.append(subject_level_data["workerid"])
            for key in new_column_labels:
              output_row.append(trial_level_data[key][i])
            output_rows.append(output_row)
        else:
          output_row = []
          # for key in mturk_output_column_names:
          #   output_row.append(subject_level_data[key])
          output_row.append(subject_level_data["workerid"])
          #print data_type
          for key in new_column_labels:
            output_row.append(subject_level_data[key])
          output_rows.append(output_row)
  write_2_by_2(output_rows, output_data_file_label + "-" + data_type + ".tsv")
  return output_rows


# trial_columns = get_column_labels("trial")
# check_trial_columns = get_column_labels("check_trial")
# subject_information_columns = get_column_labels("subject_information")
# system_columns = get_column_labels("system")

def make_full_tsv():
  trials = make_tsv("trials")
  #check_trails = make_tsv("check_trials")
  subject_information = make_tsv("subject_information")
  system = make_tsv("system")
  mturk = make_tsv("mturk")
  big_rows = [
    trials[0] + subject_information[0][1:] + system[0][1:] + mturk[0][1:]
  ]
  workerids = [row[0] for row in mturk][1:]
  for workerid in workerids:
    small_trials = [row for row in trials if row[0] == workerid] #has workerid
    #small_trials = [row for row in trials if row[0] == workerid]
    small_subject_information = [row[1:] for row in subject_information if row[0] == workerid][0]
    small_system = [row[1:] for row in system if row[0] == workerid][0]
    small_mturk = [row[1:] for row in mturk if row[0] == workerid][0]
    ntrials = len(small_trials)
    #print small_trials
    if ntrials > 0:
      for trial in small_trials:
        big_row = trial + small_subject_information + small_system + small_mturk
        big_rows.append(big_row)
  write_2_by_2(big_rows, output_data_file_label + ".tsv")

make_full_tsv()

print workers