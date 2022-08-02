//Package variables.
const Request = require('request');
const fs = require('fs');
const Chalk = require('chalk');
const AsciiTable = require('ascii-table');

//Other variables.
const Configuration = require('./config.json');
const { Agent } = require('http');
const EndPoint = `/api/client`;
const Authentication = {'auth': {'bearer': Configuration.BlueFoxHost.Token}};
AllPanelServers = [];

async function GetPanelServers(Page){
    if(Page == 1){
        E = EndPoint;
    } else {
        E = `${EndPoint}?page=${Page}`;
    };

    Request(Configuration.BlueFoxHost.URL + E, Authentication, function (error, response, body) {
        if(response.statusCode != 200) return;
        const JSON_Response = JSON.parse(body);
        JSON_Response.data.forEach(m => {
            AllPanelServers.push(m);
        });
    });
};

function PanelServerListOutPut(){
    const ConsoleOutput = new AsciiTable('DIBSTER\'s Panel Servers');
    
        ConsoleOutput.setHeading('Server Count', 'Server Name', 'Server ID', 'Server IP', 'Node');

        Counter = 1;

        AllPanelServers.forEach(s => {
            ConsoleOutput.addRow(`${Counter}`,`${s.attributes.name}`, `${s.attributes.identifier}`, `${s.attributes.relationships.allocations.data[0].attributes.ip_alias}:${s.attributes.relationships.allocations.data[0].attributes.port}`, `${s.attributes.node}`);  
            Counter++;
        });
        
        console.log(Chalk.blueBright(ConsoleOutput.toString()));
        fs.writeFileSync(`Panel-Servers.txt`, ConsoleOutput.toString());

        
    };

const RunServers = async _ => {  
    for (let i = 1; i <= 11; i++) {
      await GetPanelServers(i);
    };
    
    setTimeout(() => {
        PanelServerListOutPut();
    }, 5 * 1000);
};

RunServers();