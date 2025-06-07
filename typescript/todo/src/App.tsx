import { useState, type JSX, useMemo, Children } from "react";
import "./App.css";

type PermissionNode = {
  id: string;
  label: string;
  children?: PermissionNode[];
};

type CheckedState = boolean | "indeterminate"; 

const defaultPermissions: PermissionNode[] = [
  {
    id: "admin",
    label: "Admin",
    children: [
      { id: "admin.create", label: "Create" },
      { id: "admin.delete", label: "Delete" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    children: [
      {
        id: "reports.view",
        label: "View Reports",
        children: [
          { id: "reports.view.daily", label: "Daily" },
          { id: "reports.view.monthly", label: "Monthly" },
        ],
      },
      {
        id: "reports.access",
        label: "View Access",
      },
      {
        id: "billings",
        label: "Billings",
        children: [
          {
            id: "billings.view",
            label: "View billings",
            children: [
              { id: "billings.view.daily", label: "Daily" },
              { id: "billings.view.monthly", label: "Monthly" },
            ],
          },
        ],
      },
    ],
    
  },
];

const rootNodes = defaultPermissions.length > 0 ?  defaultPermissions : []

function App(): JSX.Element {
  const [checked, setChecked] = useState<Record<string, CheckedState>>({});

  return (
    <div>
      <PermissionsTree
        permissions={defaultPermissions}
        indent={0}
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
}

interface permissionsProps {
  permissions: PermissionNode[];
  indent: number;
  checked: Record<string, CheckedState>;
  setChecked: React.Dispatch<React.SetStateAction<Record<string, CheckedState>>>;
}


function PermissionsTree(props: permissionsProps): JSX.Element {
  const { permissions, indent, checked, setChecked } = props;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    node: PermissionNode
  ) => {
    const id = node.id;
    const checkedState = e.currentTarget.checked;

    setChecked((curr) => {
      const newState = { ...curr };
      newState[id] = checkedState;

      // changing the children
      const updateChildren = (node: PermissionNode) =>{
        if (node.children) {
          node.children.forEach((child) => {
            newState[child.id] = checkedState
            updateChildren(child);
          });
        }
      }
      updateChildren(node);

      const checkForChildren = (node: PermissionNode) => {
        if (node.children) {
          node.children.forEach((child) => checkForChildren(child))
          const allChildrenChecked = node.children.filter(child => newState[child.id] === true);
          newState[node.id] = allChildrenChecked.length === node.children.length ? true : allChildrenChecked.length === 0 ? false : "indeterminate";
        }
      }
      let startNode = rootNodes.filter((rootNode) => rootNode["id"] === node.id.split('.')[0]);

      if (startNode.length > 0) {
          checkForChildren(startNode[0]);
      }
      return newState;
    });
  };

  console.log(checked);

  return (
    <div>
      {permissions.map((permission) => {
        const nodeId = permission.id;
        return (
          <div className="indent">
            <label>
              <input
                onChange={(e) => handleChange(e, permission)}
                type="checkbox"
                value={permission.id}
                name={permission.label}
                checked={checked.hasOwnProperty(nodeId) && checked[nodeId] === true}
                ref={(el) => {
                  if (el) el.indeterminate = checked[nodeId] === "indeterminate";
                }}
              />
              {permission.label}
            </label>
            {permission.children && permission.children.length > 0 && (
              <PermissionsTree
                permissions={permission.children}
                indent={indent + 1}
                checked={checked}
                setChecked={setChecked}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
