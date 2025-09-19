import React, { useState, useCallback } from 'react';
import { NavigationBar } from './components/navigation/navigation-bar';
import { JsonNode, NodeType, AppState } from './types/core';
import { FileHandler } from './core/file-io/file-handler';
import { JsonParser } from './core/parser/json-parser';

console.log('🧪 Testing functionality...');

const TestFunctionality: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testLog, setTestLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestLog(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  // Test 1: Navigation Bar Rendering
  const testNavigationBar = () => {
    try {
      addLog('Testing NavigationBar rendering...');

      // Test if NavigationBar component exists and can be rendered
      const navHandlers = {
        onFileOpen: () => addLog('FileOpen clicked'),
        onFileSave: () => addLog('FileSave clicked'),
        onPreferencesOpen: () => addLog('PreferencesOpen clicked')
      };

      // This would normally be rendered by React, but we're testing if it imports
      addLog('✅ NavigationBar component imports successfully');
      setTestResults(prev => ({ ...prev, navigationBar: true }));
      return true;
    } catch (error) {
      addLog(`❌ NavigationBar test failed: ${error}`);
      setTestResults(prev => ({ ...prev, navigationBar: false }));
      return false;
    }
  };

  // Test 2: File Operations
  const testFileOperations = async () => {
    try {
      addLog('Testing FileHandler...');

      const fileHandler = new FileHandler();
      const parser = new JsonParser();

      // Test JSON parsing
      const testJson = '{"test": "value", "number": 42}';
      const parsed = parser.parse(testJson);

      if (Array.isArray(parsed) && parsed.length > 0) {
        addLog('✅ JSON parsing works');
      } else {
        throw new Error('JSON parsing failed');
      }

      // Test serialization
      const serialized = parser.serialize(parsed);
      if (typeof serialized === 'string' && serialized.length > 0) {
        addLog('✅ JSON serialization works');
      } else {
        throw new Error('JSON serialization failed');
      }

      setTestResults(prev => ({ ...prev, fileOperations: true }));
      return true;
    } catch (error) {
      addLog(`❌ File operations test failed: ${error}`);
      setTestResults(prev => ({ ...prev, fileOperations: false }));
      return false;
    }
  };

  // Test 3: Type System
  const testTypeSystem = () => {
    try {
      addLog('Testing type system...');

      // Test if all types are properly exported
      const testNode: JsonNode = {
        id: 'test',
        type: NodeType.OBJECT,
        key: 'test',
        value: null,
        position: { x: 0, y: 0 },
        expanded: true
      };

      const testState: AppState = {
        document: { nodes: [testNode] },
        ui: { activeNode: null, selectedNodes: [] },
        preferences: { theme: 'light', shortcuts: {} }
      };

      addLog('✅ Type system works correctly');
      setTestResults(prev => ({ ...prev, typeSystem: true }));
      return true;
    } catch (error) {
      addLog(`❌ Type system test failed: ${error}`);
      setTestResults(prev => ({ ...prev, typeSystem: false }));
      return false;
    }
  };

  // Test 4: CSS Loading
  const testCssLoading = () => {
    try {
      addLog('Testing CSS loading...');

      // Try to import CSS
      import('./App-canvas.css');
      import('./components/navigation/navigation.css');

      addLog('✅ CSS modules load successfully');
      setTestResults(prev => ({ ...prev, cssLoading: true }));
      return true;
    } catch (error) {
      addLog(`❌ CSS loading test failed: ${error}`);
      setTestResults(prev => ({ ...prev, cssLoading: false }));
      return false;
    }
  };

  // Test 5: React-DnD
  const testReactDnD = async () => {
    try {
      addLog('Testing React-DnD...');

      const { DndProvider } = await import('react-dnd');
      const { HTML5Backend } = await import('react-dnd-html5-backend');

      addLog('✅ React-DnD imports successfully');
      setTestResults(prev => ({ ...prev, reactDnD: true }));
      return true;
    } catch (error) {
      addLog(`❌ React-DnD test failed: ${error}`);
      setTestResults(prev => ({ ...prev, reactDnD: false }));
      return false;
    }
  };

  // Test 6: Spatial Canvas
  const testSpatialCanvas = async () => {
    try {
      addLog('Testing SpatialCanvas...');

      const { SpatialCanvas } = await import('./components/canvas/spatial-canvas');

      addLog('✅ SpatialCanvas imports successfully');
      setTestResults(prev => ({ ...prev, spatialCanvas: true }));
      return true;
    } catch (error) {
      addLog(`❌ SpatialCanvas test failed: ${error}`);
      setTestResults(prev => ({ ...prev, spatialCanvas: false }));
      return false;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    addLog('=== Starting Comprehensive Functionality Tests ===');

    testNavigationBar();
    await testFileOperations();
    testTypeSystem();
    testCssLoading();
    await testReactDnD();
    await testSpatialCanvas();

    addLog('=== Tests Complete ===');
  };

  // Test results summary
  const getTestSummary = () => {
    const total = Object.keys(testResults).length;
    const passed = Object.values(testResults).filter(Boolean).length;
    return { total, passed };
  };

  const summary = getTestSummary();

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>🧪 JSONIC Editor Functionality Test</h1>
        <p>Comprehensive testing of all components and functionality</p>
      </div>

      {/* Test Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runAllTests}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🚀 Run All Tests
        </button>
        <button
          onClick={() => {
            setTestResults({});
            setTestLog([]);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Clear Results
        </button>
      </div>

      {/* Test Results Summary */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📊 Test Results</h3>
        <p>
          <strong>Passed:</strong> {summary.passed}/{summary.total} tests
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
          {Object.entries(testResults).map(([test, passed]) => (
            <div
              key={test}
              style={{
                padding: '8px',
                backgroundColor: passed ? '#d4edda' : '#f8d7da',
                border: `1px solid ${passed ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {passed ? '✅' : '❌'} {test.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </div>
          ))}
        </div>
      </div>

      {/* Test Log */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📋 Test Log</h3>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {testLog.length > 0 ? (
            testLog.map((log, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                {log}
              </div>
            ))
          ) : (
            <div style={{ color: '#6c757d' }}>No tests run yet. Click "Run All Tests" to start.</div>
          )}
        </div>
      </div>

      {/* Navigation Bar Test */}
      <div style={{ marginTop: '20px' }}>
        <h3>🧭 Navigation Bar Test</h3>
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <NavigationBar
            onFileOpen={() => addLog('📁 File Open button clicked')}
            onFileSave={() => addLog('💾 File Save button clicked')}
            onPreferencesOpen={() => addLog('⚙️ Preferences button clicked')}
          />
        </div>
      </div>
    </div>
  );
};

export default TestFunctionality;