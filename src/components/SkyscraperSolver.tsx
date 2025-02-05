import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
interface CellData {
  row: number;
  col: number;
  value: string;
}

interface ClueData {
  index: number;
  value: string;
}

// Helper functions
function createInitialCells(rows: number, cols: number): CellData[][] {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value: "",
    }))
  );
}

function createInitialRowClues(rows: number): ClueData[][] {
  return [
    Array.from({ length: rows }, (_, i) => ({ index: i, value: "" })),
    Array.from({ length: rows }, (_, i) => ({ index: i, value: "" })),
  ];
}

function createInitialColClues(cols: number): ClueData[][] {
  return [
    Array.from({ length: cols }, (_, i) => ({ index: i, value: "" })),
    Array.from({ length: cols }, (_, i) => ({ index: i, value: "" })),
  ];
}

// Solver helper functions
function isValidPlacement(
  grid: string[][],
  row: number,
  col: number,
  num: string,
  size: number
): boolean {
  // Check row
  for (let x = 0; x < size; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let y = 0; y < size; y++) {
    if (grid[y][col] === num) return false;
  }
  
  return true;
}

function countVisibleSkyscrapers(heights: string[]): number {
  let maxHeight = 0;
  let count = 0;
  
  for (const height of heights) {
    const h = parseInt(height);
    if (h > maxHeight) {
      maxHeight = h;
      count++;
    }
  }
  
  return count;
}

function checkClueConstraint(
  grid: string[][],
  clue: string,
  index: number,
  direction: 'row' | 'col',
  fromStart: boolean
): boolean {
  if (!clue) return true;
  
  const clueValue = parseInt(clue);
  
  let heights: string[];
  if (direction === 'row') {
    heights = fromStart 
      ? grid[index].slice()
      : grid[index].slice().reverse();
  } else {
    heights = fromStart
      ? grid.map(row => row[index])
      : grid.map(row => row[index]).reverse();
  }
  
  return countVisibleSkyscrapers(heights) === clueValue;
}

function solvePuzzle(
  grid: string[][],
  rowClues: [string[], string[]],
  colClues: [string[], string[]],
  row: number = 0,
  col: number = 0
): boolean {
  const size = grid.length;
  
  if (row === size) {
    // Check all clues after grid is filled
    for (let i = 0; i < size; i++) {
      // Check row clues
      if (!checkClueConstraint(grid, rowClues[0][i], i, 'row', true)) return false;
      if (!checkClueConstraint(grid, rowClues[1][i], i, 'row', false)) return false;
      
      // Check column clues
      if (!checkClueConstraint(grid, colClues[0][i], i, 'col', true)) return false;
      if (!checkClueConstraint(grid, colClues[1][i], i, 'col', false)) return false;
    }
    return true;
  }
  
  if (col === size) {
    return solvePuzzle(grid, rowClues, colClues, row + 1, 0);
  }
  
  if (grid[row][col] !== '') {
    return solvePuzzle(grid, rowClues, colClues, row, col + 1);
  }
  
  for (let num = 1; num <= size; num++) {
    const numStr = num.toString();
    if (isValidPlacement(grid, row, col, numStr, size)) {
      grid[row][col] = numStr;
      
      if (solvePuzzle(grid, rowClues, colClues, row, col + 1)) {
        return true;
      }
      
      grid[row][col] = '';
    }
  }
  
  return false;
}

// Arrow SVG Components
const ArrowDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/30 pointer-events-none" aria-hidden="true">
    <path d="M12 8v8M8 12l4 4 4-4"/>
  </svg>
);

const ArrowUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/30 pointer-events-none" aria-hidden="true">
    <path d="M12 16V8M8 12l4-4 4 4"/>
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/30 pointer-events-none" aria-hidden="true">
    <path d="M8 12h8M12 8l4 4-4 4"/>
  </svg>
);

const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/30 pointer-events-none" aria-hidden="true">
    <path d="M16 12H8M12 8l-4 4 4 4"/>
  </svg>
);

export default function SkyscraperSolver() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [cells, setCells] = useState<CellData[][]>(() => createInitialCells(rows, cols));
  const [rowClues, setRowClues] = useState<ClueData[][]>(() => createInitialRowClues(rows));
  const [colClues, setColClues] = useState<ClueData[][]>(() => createInitialColClues(cols));
  const [showControls, setShowControls] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setCells(createInitialCells(rows, cols));
    setRowClues(createInitialRowClues(rows));
    setColClues(createInitialColClues(cols));
    setIsSolved(false);
    setStatusMessage("");
  }, [rows, cols]);

  const handleCellChange = (rowIndex: number, colIndex: number, newValue: string) => {
    if (newValue === "" || /^[1-9]$/.test(newValue)) {
      setCells((prev) => {
        const updated = prev.map((row) => row.slice());
        updated[rowIndex][colIndex] = {
          ...updated[rowIndex][colIndex],
          value: newValue,
        };
        return updated;
      });
    }
  };

  const handleRowClueChange = (side: 0 | 1, rowIndex: number, newValue: string) => {
    if (newValue === "" || /^[1-9]$/.test(newValue)) {
      setRowClues((prev) => {
        const updated = prev.map((sideArray) => sideArray.slice());
        updated[side][rowIndex] = {
          ...updated[side][rowIndex],
          value: newValue,
        };
        return updated;
      });
    }
  };

  const handleColClueChange = (side: 0 | 1, colIndex: number, newValue: string) => {
    if (newValue === "" || /^[1-9]$/.test(newValue)) {
      setColClues((prev) => {
        const updated = prev.map((sideArray) => sideArray.slice());
        updated[side][colIndex] = {
          ...updated[side][colIndex],
          value: newValue,
        };
        return updated;
      });
    }
  };

  const handleSolve = () => {
    setStatusMessage("Solving...");
    
    // Convert cells to a 2D array of strings
    const grid = cells.map(row => row.map(cell => cell.value));
    const currentRowClues: [string[], string[]] = [
      rowClues[0].map(c => c.value),
      rowClues[1].map(c => c.value)
    ];
    const currentColClues: [string[], string[]] = [
      colClues[0].map(c => c.value),
      colClues[1].map(c => c.value)
    ];
    
    setTimeout(() => {
      try {
        const solved = solvePuzzle(grid, currentRowClues, currentColClues);
        
        if (solved) {
          // Update the cells with the solution
          setCells(grid.map((row, i) => 
            row.map((value, j) => ({
              row: i,
              col: j,
              value: value
            }))
          ));
          setIsSolved(true);
          setStatusMessage("Puzzle Solved!");
        } else {
          setStatusMessage("No solution exists!");
        }
      } catch (error) {
        setStatusMessage("Error solving puzzle!");
        console.error(error);
      }
    }, 100);
  };

  const handleReset = () => {
    setCells(createInitialCells(rows, cols));
    setRowClues(createInitialRowClues(rows));
    setColClues(createInitialColClues(cols));
    setIsSolved(false);
    setStatusMessage("");
  };

  const handleCopyToClipboard = () => {
    const textToCopy = cells
      .map((row) => row.map((cell) => cell.value || " ").join(","))
      .join("\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      setStatusMessage("Copied grid to clipboard!");
      setTimeout(() => {
        setStatusMessage("");
      }, 2000);
    });
  };

  const handleCellKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number,
    inputType: 'cell' | 'row-left' | 'row-right' | 'col-top' | 'col-bottom' = 'cell'
  ) => {
    if (!isSolved) {
      let nextRow = rowIndex;
      let nextCol = colIndex;
      let nextType = inputType;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (inputType === 'cell') {
            if (rowIndex === 0) {
              nextType = 'col-top';
            } else {
              nextRow = Math.max(rowIndex - 1, 0);
            }
          } else if (inputType === 'col-bottom') {
            nextType = 'cell';
            nextRow = rows - 1;
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (inputType === 'cell') {
            if (rowIndex === rows - 1) {
              nextType = 'col-bottom';
            } else {
              nextRow = Math.min(rowIndex + 1, rows - 1);
            }
          } else if (inputType === 'col-top') {
            nextType = 'cell';
            nextRow = 0;
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (inputType === 'cell') {
            if (colIndex === 0) {
              nextType = 'row-left';
            } else {
              nextCol = Math.max(colIndex - 1, 0);
            }
          } else if (inputType === 'row-right') {
            nextType = 'cell';
            nextCol = cols - 1;
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (inputType === 'cell') {
            if (colIndex === cols - 1) {
              nextType = 'row-right';
            } else {
              nextCol = Math.min(colIndex + 1, cols - 1);
            }
          } else if (inputType === 'row-left') {
            nextType = 'cell';
            nextCol = 0;
          }
          break;
      }

      let nextId = '';
      switch (nextType) {
        case 'cell':
          nextId = `cell-${nextRow}-${nextCol}`;
          break;
        case 'row-left':
          nextId = `row-left-${nextRow}`;
          break;
        case 'row-right':
          nextId = `row-right-${nextRow}`;
          break;
        case 'col-top':
          nextId = `col-top-${nextCol}`;
          break;
        case 'col-bottom':
          nextId = `col-bottom-${nextCol}`;
          break;
      }

      const nextElt = document.getElementById(nextId) as HTMLInputElement | null;
      if (nextElt) {
        nextElt.focus();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-background"
      aria-label="Skyscrapers Solver"
    >
      <Card className="w-full max-w-4xl shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="w-full flex flex-col items-center space-y-4 sm:space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Skyscraper Solver</h1>

            <div className="w-full max-w-fit flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Label htmlFor="rows" className="min-w-fit text-base">Rows:</Label>
                  <Input
                    id="rows"
                    type="number"
                    min={2}
                    max={9}
                    value={rows}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setRows(Math.min(9, Math.max(2, parseInt(e.target.value) || 2)))
                    }
                    className="w-14 text-base"
                  />
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <Label htmlFor="cols" className="min-w-fit text-base">Cols:</Label>
                  <Input
                    id="cols"
                    type="number"
                    min={2}
                    max={9}
                    value={cols}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCols(Math.min(9, Math.max(2, parseInt(e.target.value) || 2)))
                    }
                    className="w-14 text-base"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowControls(!showControls)}
                  aria-expanded={showControls}
                  className="text-base px-3 h-9"
                >
                  {showControls ? "Hide Controls" : "Show Controls"}
                </Button>
              </div>
            </div>

            {showControls && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-fit p-4 bg-muted rounded-lg"
              >
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use arrow keys to navigate between cells</p>
                  <p>• Enter numbers 1-{Math.max(rows, cols)} in each cell</p>
                  <p>• Enter clues on the edges to indicate visible skyscrapers</p>
                  <p>• Each row and column must contain unique numbers</p>
                </div>
              </motion.div>
            )}

            <div className="w-full max-w-fit flex justify-center gap-2">
              <div className="flex items-center gap-2">
                <Button onClick={handleSolve} disabled={isSolved} className="text-base px-4 h-9">
                  Solve Puzzle
                </Button>
                <Button variant="secondary" onClick={handleReset} className="text-base px-4 h-9">
                  Reset
                </Button>
                <Button variant="outline" onClick={handleCopyToClipboard} className="text-base px-4 h-9">
                  Copy to Clipboard
                </Button>
              </div>
            </div>

            {statusMessage && (
              <p className="text-sm text-primary" role="status">
                {statusMessage}
              </p>
            )}

            <div className="w-full max-w-fit overflow-x-auto pb-4">
              <div className="inline-block align-middle">
                <table
                  className="border-separate border-spacing-0"
                  role="grid"
                  aria-label="Skyscraper puzzle grid"
                >
                  <thead>
                    <tr>
                      <th className="w-14 sm:w-16" />
                      {colClues[0].map((clue, colIdx) => (
                        <th key={colIdx} className="p-1 w-7 sm:w-10 md:w-12">
                          <div className="relative w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12">
                            <ArrowDown />
                            <Input
                              id={`col-top-${colIdx}`}
                              type="text"
                              value={clue.value}
                              onChange={(e) => handleColClueChange(0, colIdx, e.target.value)}
                              onKeyDown={(e) => handleCellKeyDown(e, 0, colIdx, 'col-top')}
                              className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center p-0 text-base hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:bg-muted/50 transition-colors"
                              aria-label={`Top clue for column ${colIdx + 1}`}
                            />
                          </div>
                        </th>
                      ))}
                      <th className="w-14 sm:w-16" />
                    </tr>
                  </thead>

                  <tbody>
                    {cells.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="p-1">
                          <div className="relative w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12">
                            <ArrowRight />
                            <Input
                              id={`row-left-${rowIdx}`}
                              type="text"
                              value={rowClues[0][rowIdx].value}
                              onChange={(e) => handleRowClueChange(0, rowIdx, e.target.value)}
                              onKeyDown={(e) => handleCellKeyDown(e, rowIdx, 0, 'row-left')}
                              className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center p-0 text-base hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:bg-muted/50 transition-colors"
                              aria-label={`Left clue for row ${rowIdx + 1}`}
                            />
                          </div>
                        </td>

                        {row.map((cell, colIdx) => (
                          <td
                            key={colIdx}
                            className="p-0 border border-border w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12"
                          >
                            <Input
                              id={`cell-${rowIdx}-${colIdx}`}
                              type="text"
                              value={cell.value}
                              onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                              onKeyDown={(e) => handleCellKeyDown(e, rowIdx, colIdx)}
                              disabled={isSolved}
                              className="w-full h-full text-center p-0 border-0 rounded-none text-base hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:bg-muted/50 transition-colors"
                              aria-label={`Cell at row ${rowIdx + 1}, column ${colIdx + 1}`}
                            />
                          </td>
                        ))}

                        <td className="p-1">
                          <div className="relative w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12">
                            <ArrowLeft />
                            <Input
                              id={`row-right-${rowIdx}`}
                              type="text"
                              value={rowClues[1][rowIdx].value}
                              onChange={(e) => handleRowClueChange(1, rowIdx, e.target.value)}
                              onKeyDown={(e) => handleCellKeyDown(e, rowIdx, cols - 1, 'row-right')}
                              className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center p-0 text-base hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:bg-muted/50 transition-colors"
                              aria-label={`Right clue for row ${rowIdx + 1}`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td className="w-14 sm:w-16" />
                      {colClues[1].map((clue, colIdx) => (
                        <td key={colIdx} className="p-1 w-7 sm:w-10 md:w-12">
                          <div className="relative w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12">
                            <ArrowUp />
                            <Input
                              id={`col-bottom-${colIdx}`}
                              type="text"
                              value={clue.value}
                              onChange={(e) => handleColClueChange(1, colIdx, e.target.value)}
                              onKeyDown={(e) => handleCellKeyDown(e, rows - 1, colIdx, 'col-bottom')}
                              className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center p-0 text-base hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:bg-muted/50 transition-colors"
                              aria-label={`Bottom clue for column ${colIdx + 1}`}
                            />
                          </div>
                        </td>
                      ))}
                      <td className="w-14 sm:w-16" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 
