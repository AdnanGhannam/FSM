import { Component } from '@angular/core';
import {ArrayDataSource} from '@angular/cdk/collections';
import {NestedTreeControl} from '@angular/cdk/tree';

// TODO modify
interface FoodNode {
  name: string;
  children?: FoodNode[];
  type?: "folder" | "file";
};

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    type: "folder",
    children: [{name: 'Apple', type: "folder"}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    type: "folder",
    children: [
      {
        name: 'Green',
        type: "folder",
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        type: "folder",
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

@Component({
  selector: 'fms-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new ArrayDataSource(TREE_DATA);

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
