# Skyscraper Solver

A modern web application for solving skyscraper puzzles. Built with React, TypeScript, and Vite, featuring a clean UI and PWA support.

## Features

- Interactive puzzle grid with keyboard navigation
- Clue inputs for all sides of the grid
- Automatic puzzle solving
- Copy grid to clipboard functionality
- Progressive Web App (PWA) support
- Mobile-friendly responsive design
- Dark mode support
- Keyboard navigation support

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/alvarlaigna/skyscraper-solver.git

# Navigate to project directory
cd skyscraper-solver

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Building for Production

```bash
# Create production build
yarn build

# Preview production build
yarn preview
```

## Usage

1. Set the grid size using the rows and columns inputs
2. Enter clue numbers (1-9) on the edges of the grid
3. Enter known numbers in the grid cells (optional)
4. Click "Solve Puzzle" to find the solution
5. Use "Reset" to clear the grid
6. Use "Copy to Clipboard" to copy the current grid state

### Keyboard Navigation

- Use arrow keys to move between cells and clue inputs
- Enter numbers 1-9 in cells and clue inputs
- Tab to navigate between controls

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Copyright

Copyright © 2025 Alvar Laigna (alvarlaigna.com)

## License

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
