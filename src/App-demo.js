import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import JsonNodeDemo from './components/demos/JsonNodeDemo';
import './App.css';
const App = () => {
    return (_jsx("div", { className: "app", children: _jsxs(DndProvider, { backend: HTML5Backend, children: [_jsx("header", { className: "app-header", children: _jsx("h1", { children: "JSONIC Editor" }) }), _jsx("main", { className: "app-main", children: _jsx(JsonNodeDemo, {}) })] }) }));
};
export default App;
