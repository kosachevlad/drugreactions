@echo off
REM opens the database and leaves the user at the sqlite prompt

SET dbfile=..\db\drug-reactions.sqlite3

sqlite3 %dbfile%