#!/bin/bash

create_firestore_database() {
	local database_name=$1
	local location=$2
	local type=$3

	if gcloud firestore databases create --database="$database_name" --location="$location" --type="$type"; then
		echo "Successfully created Firestore database: $database_name"
	else
		echo "Failed to create Firestore database: $database_name"
		exit 1 # Exit script if command fails
	fi
}

read -p "Do you want to create the 'students' Firestore database? (y/n) " response
if [[ $response =~ ^[Yy]$ ]]; then
	create_firestore_database "students" "us-west1" "firestore-native"
fi

read -p "Do you want to create the 'teachers' Firestore database? (y/n) " response
if [[ $response =~ ^[Yy]$ ]]; then
	create_firestore_database "teachers" "us-west1" "firestore-native"

fi
