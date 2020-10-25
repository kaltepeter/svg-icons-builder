import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

describe('ng-add', () => {
  let tree;

  beforeEach(() => {
    
  });
  
  it('works', async () => {
    tree = await runner.runSchematicAsync('ng-add', {}, Tree.empty()).toPromise();
    // const packageJson = readJsonInTree(result, 'package.json');

    expect(tree.files).toEqual([]);
  });
});
