import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';

interface Rule {
  fact: string;
  operator: string;
  value: any;
}

interface Group {
  condition: string;
  rules: (Rule | Group)[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './main.html',
  styleUrl: './main.scss',
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class App {
  public group: Group = {
      condition: 'ANY',
      rules: [
          {
              condition: 'ALL',
              rules: [
                  { fact: 'f1', operator: 'equals', value: 1 },
                  { fact: 'f1', operator: 'equals', value: 1 }
              ]
          },
          {
              condition: 'ANY',
              rules: [
                  {
                      condition: 'ALL',
                      rules: [
                          { fact: 'f1', operator: 'equals', value: 1 },
                          { fact: 'f1', operator: 'equals', value: 1 }
                      ]
                  },
                  { fact: 'f1', operator: 'equals', value: 1 }
              ]
          }
      ]
  };

  addGroup(group: Group) {
      group.rules.push({
          condition: 'ANY',
          rules: []
      });
  }

  addRule(group: Group) {
      group.rules.push({
          fact: '',
          operator: '',
          value: ''
      });
  }

  removeRule(group: Group, index: number) {
      group.rules.splice(index, 1);
  }

  isGroup(rule: Rule | Group): rule is Group {
      return (rule as Group).rules !== undefined;
  }


  generateRules() {
      alert("check Console!");
      console.log(this.group);
  }
}

bootstrapApplication(App);
