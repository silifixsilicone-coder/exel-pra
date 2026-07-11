export class DependencyGraph {
  // maps cell -> cells it depends on
  private deps: Map<string, Set<string>> = new Map();
  // maps cell -> cells that depend on it
  private revDeps: Map<string, Set<string>> = new Map();

  addCell(cellKey: string, cellDeps: string[]) {
    // Clear old dependencies
    this.removeCell(cellKey);

    const depSet = new Set(cellDeps);
    this.deps.set(cellKey, depSet);

    depSet.forEach(dep => {
      if (!this.revDeps.has(dep)) {
        this.revDeps.set(dep, new Set());
      }
      this.revDeps.get(dep)!.add(cellKey);
    });
  }

  removeCell(cellKey: string) {
    const oldDeps = this.deps.get(cellKey);
    if (oldDeps) {
      oldDeps.forEach(dep => {
        const revs = this.revDeps.get(dep);
        if (revs) {
          revs.delete(cellKey);
          if (revs.size === 0) {
            this.revDeps.delete(dep);
          }
        }
      });
      this.deps.delete(cellKey);
    }
  }

  // Checks if adding new dependencies to cellKey would create a cycle (circular reference)
  hasCycle(cellKey: string, proposedDeps: string[]): boolean {
    const visited = new Set<string>();
    const stack = new Set<string>();

    // Temporarily save original dependencies
    const originalDeps = this.deps.get(cellKey);
    
    // Set temporary proposed dependencies
    this.deps.set(cellKey, new Set(proposedDeps));

    const dfs = (node: string): boolean => {
      visited.add(node);
      stack.add(node);

      const neighbors = this.deps.get(node);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            if (dfs(neighbor)) return true;
          } else if (stack.has(neighbor)) {
            return true; // Cycle detected
          }
        }
      }

      stack.delete(node);
      return false;
    };

    // Run DFS starting from cellKey
    const cycleDetected = dfs(cellKey);

    // Restore original dependencies
    if (originalDeps) {
      this.deps.set(cellKey, originalDeps);
    } else {
      this.deps.delete(cellKey);
    }

    return cycleDetected;
  }

  // Returns all cells that directly or indirectly depend on startNode, sorted topologically
  getDependents(startNode: string): string[] {
    const visited = new Set<string>();
    const topologicalOrder: string[] = [];

    // Helper to traverse DFS post-order
    const dfs = (node: string) => {
      visited.add(node);
      const dependents = this.revDeps.get(node);
      if (dependents) {
        dependents.forEach(dep => {
          if (!visited.has(dep)) {
            dfs(dep);
          }
        });
      }
      topologicalOrder.push(node);
    };

    // Traverse starting from startNode (which changed)
    const dependents = this.revDeps.get(startNode);
    if (dependents) {
      dependents.forEach(dep => {
        if (!visited.has(dep)) {
          dfs(dep);
        }
      });
    }

    // Since dfs pushes in post-order, reverse it to get correct topological evaluation order!
    return topologicalOrder.reverse();
  }

  clear() {
    this.deps.clear();
    this.revDeps.clear();
  }
}
