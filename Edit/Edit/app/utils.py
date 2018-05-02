import pandas as pd
import os

"""
Filter down our data to something displayable based on parameters from the main page.

:param species:
:param ref_genome: reference genome to use
:param annotations: annotation columns to display (default all)
:param phenotypes: phenotype columns to display (default all)
:param return_as: json or numpy (default json)
:returns: the filtered dataset
"""


def filter_table(species="maize", ref_genome="", annotations=None, phenotypes=None, return_as="json"):
    my_path = os.path.split(os.path.realpath(__file__))[0]
    csv_path = os.path.join(my_path, "..", "..", "..", "data", "merged_data.csv")
    data = pd.read_csv(csv_path)
    columns = []
    if annotations:
        columns.extend(annotations)
    if phenotypes:
        columns.extend(phenotypes)
    data = data.loc[:, columns]

    if return_as == "json":
        return data.to_json(orient="records")
    elif return_as == "numpy":
        return data
    else:
        raise ValueError("return_as must be json or numpy, not " + str(return_as))
