'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const Button = ({ onClick, className = '', children }: {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
  }) => (
    <motion.button
      className={`h-12 rounded-lg font-semibold text-lg transition-all duration-150 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="h-full bg-gray-50 p-4 flex flex-col">
      {/* Display */}
      <div className="bg-black text-white p-4 rounded-lg mb-4">
        <div className="text-right text-3xl font-mono font-light overflow-hidden">
          {display}
        </div>
        {operation && previousValue !== null && (
          <div className="text-right text-sm text-gray-400 font-mono">
            {previousValue} {operation}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex-1 grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <Button
          onClick={clear}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          AC
        </Button>
        <Button
          onClick={() => {
            setDisplay(display.slice(0, -1) || '0');
          }}
          className="bg-gray-300 hover:bg-gray-400 text-black"
        >
          ⌫
        </Button>
        <Button
          onClick={() => inputOperation('÷')}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          ÷
        </Button>
        <Button
          onClick={() => inputOperation('×')}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          ×
        </Button>

        {/* Row 2 */}
        <Button
          onClick={() => inputNumber('7')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          7
        </Button>
        <Button
          onClick={() => inputNumber('8')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          8
        </Button>
        <Button
          onClick={() => inputNumber('9')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          9
        </Button>
        <Button
          onClick={() => inputOperation('-')}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          -
        </Button>

        {/* Row 3 */}
        <Button
          onClick={() => inputNumber('4')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          4
        </Button>
        <Button
          onClick={() => inputNumber('5')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          5
        </Button>
        <Button
          onClick={() => inputNumber('6')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          6
        </Button>
        <Button
          onClick={() => inputOperation('+')}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          +
        </Button>

        {/* Row 4 */}
        <Button
          onClick={() => inputNumber('1')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          1
        </Button>
        <Button
          onClick={() => inputNumber('2')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          2
        </Button>
        <Button
          onClick={() => inputNumber('3')}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          3
        </Button>
        <Button
          onClick={performCalculation}
          className="bg-blue-500 hover:bg-blue-600 text-white row-span-2"
        >
          =
        </Button>

        {/* Row 5 */}
        <Button
          onClick={() => inputNumber('0')}
          className="bg-white hover:bg-gray-100 text-black border col-span-2"
        >
          0
        </Button>
        <Button
          onClick={inputDecimal}
          className="bg-white hover:bg-gray-100 text-black border"
        >
          .
        </Button>
      </div>
    </div>
  );
};

export default Calculator;