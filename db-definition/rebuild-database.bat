@echo off
REM NUKES the whole database and rebuilds it

SET dbfile=..\db\drug-reactions.sqlite3
SET tmpCommandFile=tmp-rebuild-database.txt

REM Populate a temporary file with sqlite commands to nuke all existing tables and indexes that 
REM we know about, recreate them and reload them with data from the reference csv files.
echo .read sql/drop-tables.sql > %tmpCommandFile%
echo .read sql/create-tables.sql >> %tmpCommandFile%
echo .mode csv >> %tmpCommandFile%
echo .import data/tbl_drug_std.csv Drug >> %tmpCommandFile%
echo .import data/tbl_reaction.csv Reaction >> %tmpCommandFile%
echo .import data/tbl_drug_reaction.csv DrugReaction >> %tmpCommandFile%

REM Run that file
sqlite3 %dbfile% < %tmpCommandFile%

REM ... and delete the temporary command file, to clean things up neatly.
DEL %tmpCommandFile%