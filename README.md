# CMPT-474-Project-Navigator

In /frontend:
gcloud builds submit --tag gcr.io/{projectname}/{instance} 
gcloud run deploy --image gcr.io/{projectname}/{instance}

In root:
firebase deploy --only functions,hosting

OR Emulator:

frontend: npm run dev 
root: firebase serve

Current structure:
```
├── README.md
├── common
│   └── utils
│       └── helper.js
├── public
│   ├── base.html
│   ├── script.js
│   └── styles.css
└── services
    ├── auth
    │   └── index.js
    ├── reports
    │   └── index.js
    ├── student
    │   └── index.js
    └── teacher
        └── index.js
```

