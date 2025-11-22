"use client";
import React, { useState } from "react";
import { FormControl, Button, Alert, ButtonGroup } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function RequestParameters() {
  const [a, setA] = useState("2");
  const [b, setB] = useState("5");
  const [result, setResult] = useState<string | null>(null);

  const performOperationJSON = async (operation: string) => {
    try {
      const response = await fetch(`${HTTP_SERVER}/lab5/calculator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, a: parseFloat(a), b: parseFloat(b) })
      });
      const data = await response.json();
      setResult(`Request Result: {${data.result}}`);
    } catch (error) {
      setResult("Error with JSON request");
    }
  };
  return (
    <div id="wd-request-parameters">
      <h3> Request Parameters</h3>
      
      <FormControl
        className="mb-2"  
        value={a}
        type="number"
        placeholder="Enter a"
        onChange={(e) => setA(e.target.value)}
      />
      
      <FormControl
        className="mb-3"
        value={b}
        type="number"
        placeholder="Enter b"
        onChange={(e) => setB(e.target.value)}
      />

      {result && <Alert variant="info">{result}</Alert>}
      <Button variant="primary" onClick={() => performOperationJSON("add")}>
        Add Operation ({a} + {b})
      </Button>
      <hr />
      <Button variant="warning" onClick={() => performOperationJSON("subtract")}>
        Subtract Operation ({a} - {b})
      </Button>
      <hr />
      <Button variant="success" onClick={() => performOperationJSON("multiply")}>
        Multiply Operation ({a} * {b})
      </Button>
      <hr />
      <Button variant="danger" onClick={() => performOperationJSON("divide")}>
        Divide Operation ({a} / {b})
      </Button>
      <hr />
    </div>
  );
}
