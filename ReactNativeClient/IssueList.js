import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://192.168.1.31:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
          <Text>This is a placeholder for the issue filter.</Text>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
  });

const width= [40,80,80,80,80,80,200];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const rowData = [issue.id, issue.status, issue.owner, issue.created.toDateString(), issue.effort, issue.due ? issue.due.toDateString() : '', issue.title];
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
        <Row key={props.key} data={rowData} widthArr={width} style={styles.row} textStyle={styles.text} />
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const [ tableHeaders, setTableHeaders ] = useState(["ID", "Status", "Owner", "Created", "Effort", "Due Date", "Title"]);
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
    <View style={styles.container}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
      <ScrollView horizontal={true} style={styles.dataWrapper}>
        <View>
          <Table>
            <Row data={tableHeaders} widthArr={width} style={styles.header} textStyle={styles.text}/>
            { issueRows }
          </Table>
        </View>
      </ScrollView>
    {/****** Q2: Coding Ends here. ******/}
    </View>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = {
        inputs: {}
      }
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setFormValues(key, value) {
      const inputs = this.state.inputs;
      inputs[key] = value;

      this.setState({ inputs: inputs });
    } 
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const inputs = this.state.inputs;

      if (!('owner' in inputs)) {
        alert("The field 'Owner' is required.");
      } else if (!('title' in inputs)) {
        alert("The field 'Title' is required.");
      } else if (!('effort' in inputs)) {
        alert("The field 'Effort' is required.");
      } else {
        const issue = {
          owner: inputs.owner, title: inputs.title,  effort: inputs.effort,
          due: new Date(new Date().getTime() + 1000*60*60*24*10),
        };
        this.props.createIssue(issue);
  
        this.setState({ inputs: {} })
        alert("Issue added successfully.")
      }
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <TextInput placeholder="Owner" value={this.state.inputs["owner"]} onChangeText={ (value) => {this.setFormValues("owner", value)} }/>
            <TextInput placeholder="Title" value={this.state.inputs["title"]} onChangeText={ (value) => {this.setFormValues("title", value)} }/>
            <TextInput placeholder="Effort" value={this.state.inputs["effort"]} onChangeText={ (value) => {this.setFormValues("effort", value)} }/>
            <Button title="Add Issue" onPress={ () => {this.handleSubmit()} }/>
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = { nameInput: "" }
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setNameInput(value) {
      this.setState({ nameInput: value });
    } 
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const nameInput = this.state.nameInput;
    this.props.addToBlacklist(nameInput);

    this.setState({ nameInput: "" });
    alert(`${nameInput} has been added to the blacklist.`)
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <TextInput placeholder="Owner Name" value={this.state.nameInput} onChangeText={ (value) => {this.setNameInput(value)} }/>
        <Button title="Add to Blacklist" onPress={ () => {this.handleSubmit()} }/>
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
        this.addToBlacklist = this.addToBlacklist.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;
  
    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }

    async addToBlacklist(name) {
      const query = `mutation addToBlacklist($nameInput: String!) {
          addToBlacklist(nameInput: $nameInput)
      }`

      const data = await graphQLFetch(query, { nameInput: name });
    };


    render() {
    return (
    <>
    {/****** Q1: Start Coding here. ******/}
      <IssueFilter />
    {/****** Q1: Code ends here ******/}

    {/****** Q2: Start Coding here. ******/}
      <IssueTable issues={this.state.issues}/>
    {/****** Q2: Code ends here ******/}

    {/****** Q3: Start Coding here. ******/}
      <IssueAdd createIssue={this.createIssue}/>
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
      <BlackList addToBlacklist={this.addToBlacklist}/>
    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
