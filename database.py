from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///train_tracker.db")

engine = create_engine(DATABASE_URL, echo=True)

session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

class Train(Base):
    __tablename__ = 'trains'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    departure = Column(DateTime)
    arrival = Column(DateTime)

def init_db():
    Base.metadata.create_all(bind=engine)

def drop_and_create_all():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()