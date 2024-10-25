from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Define a custom naming convention for foreign keys
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize the SQLAlchemy instance with the custom metadata
db = SQLAlchemy(metadata=metadata)
