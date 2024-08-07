import { Component, OnInit } from '@angular/core';
import dragula from 'dragula';

import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class App implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.initializeDragula();
    this.renderRules();
  }

  initializeDragula() {
    dragula({
      isContainer: function (el: any) {
        return el.classList.contains('group-container');
      },
      moves: function (el: any, source: any, handle: any, sibling: any) {
        return handle.classList.contains('drag-handler');
      },
    });
  }

  generateRules() {
    const firstChildren = document.querySelector('.rule-definition')!
      .children as HTMLCollection;
    const rule = this.generate(firstChildren as any);
    const ruleStr = JSON.stringify(rule, null, 4);
    alert('Check Console!');
    console.log(rule);
    console.log(ruleStr);
  }

  generate(block: Element): any {
    if (block.classList.contains('rule')) {
      return { fact: 'f1', operator: 'equals', value: 1 };
    } else if (
      (block.querySelector('.options select') as HTMLSelectElement).value ==
      'ALL'
    ) {
      const groupArray = block.querySelectorAll(
        '.group-container .group, .rule'
      );
      const data: any[] = [];
      groupArray.forEach((e) => data.push(this.generate(e)));
      return { all: data };
    } else if (
      (block.querySelector('.options select') as HTMLSelectElement).value ==
      'ANY'
    ) {
      const groupArray = block.querySelectorAll(
        '.group-container .group, .rule'
      );
      const data: any[] = [];
      groupArray.forEach((e) => data.push(this.generate(e)));
      return { any: data };
    }
  }

  addRule(event: Event) {
    const ruleTemplate = (
      document.querySelector('.rule-template') as HTMLElement
    ).cloneNode(true) as HTMLElement;
    ruleTemplate.classList.remove('rule-template');
    ruleTemplate.classList.add('rule');
    ruleTemplate.style.display = 'block';
    (event.target as HTMLElement)
      .closest('.group')
      ?.querySelector('.group-container')
      ?.appendChild(ruleTemplate);
  }

  removeRule(event: Event) {
    (event.target as HTMLElement).closest('.rule')?.remove();
  }

  removeGroup(event: Event) {
    const group = (event.target as HTMLElement).closest('.group');
    if (group?.querySelectorAll('.rule').length) {
      alert('It has rules, first you need to remove them');
    } else {
      group?.remove();
    }
  }

  addGroup(event: Event) {
    const existGroup = (event.target as HTMLElement).closest('.group');
    const container = existGroup?.querySelector('.group-container');

    const groupTemplate = (
      document.querySelector('.group-template') as HTMLElement
    ).cloneNode(true) as HTMLElement;
    groupTemplate.classList.remove('group-template');
    groupTemplate.classList.add('group');
    container?.appendChild(groupTemplate);

    groupTemplate.style.display = 'block';
  }

  renderRules() {
    const conditions = {}; // You need to define your conditions object here
    const html = this.render(conditions);
    (document.querySelector('.rule-definition') as HTMLElement).innerHTML =
      html;
  }

  render(data: any): string {
    if (Array.isArray(data)) {
      return data.map((r) => this.render(r)).join('');
    } else {
      let html = '';
      if (data.all) {
        const groupTemplate = (
          document.querySelector('.group-template') as HTMLElement
        ).cloneNode(true) as HTMLElement;
        groupTemplate.classList.remove('group-template');
        groupTemplate.classList.add('group');
        groupTemplate.style.display = 'block';
        (
          groupTemplate.querySelector(
            "select option[value='ALL']"
          ) as HTMLOptionElement
        ).selected = true;
        const innerHtml = this.render(data.all);
        (
          groupTemplate.querySelector('.group-container') as HTMLElement
        ).innerHTML = innerHtml;
        html = groupTemplate.outerHTML;
      } else if (data.any) {
        const groupTemplate = (
          document.querySelector('.group-template') as HTMLElement
        ).cloneNode(true) as HTMLElement;
        groupTemplate.classList.remove('group-template');
        groupTemplate.classList.add('group');
        groupTemplate.style.display = 'block';
        (
          groupTemplate.querySelector(
            "select option[value='ANY']"
          ) as HTMLOptionElement
        ).selected = true;
        const innerHtml = this.render(data.any);
        (
          groupTemplate.querySelector('.group-container') as HTMLElement
        ).innerHTML = innerHtml;
        html = groupTemplate.outerHTML;
      } else {
        const ruleTemplate = (
          document.querySelector('.rule-template') as HTMLElement
        ).cloneNode(true) as HTMLElement;
        ruleTemplate.classList.remove('rule-template');
        ruleTemplate.classList.add('rule');
        ruleTemplate.style.display = 'block';
        html = ruleTemplate.outerHTML;
      }
      return html;
    }
  }
}

bootstrapApplication(App);
