let items = [
    { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
    { id: 4, seqId: 5, parent: 1, name: "Table" },
    { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
    { id: 6, seqId: 2, parent: null, name: "controllers" },
    { id: 2, seqId: 4, parent: 5, name: "index.tsx" },
    { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
    { id: 1, seqId: 1, parent: null, name: "components" },
    { id: 100, seqId: 1, parent: 5, name: "components2" },
    { id: 101, seqId: 1, parent: 100, name: "components3" }
];

const idMapping = items.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
}, {});

const createTrees = () => {
    let tree = [];
    items.forEach((element) => {
        if (element.parent === null || idMapping[element.parent] == null) {
            tree.push(element);
            return;
        }

        const parentEl = items[idMapping[element.parent]];
        parentEl.children = [...(parentEl.children || []), element];
    });

    return tree;
};

const flatTree = (element, depth) => {
    element.depth = depth++;

    if (!element.children) {
        return element;
    } else {
        return [
        element,
        ...element.children
            .sort(function (a, b) {
                return a.seqId - b.seqId;
            })
            .map((el) => flatTree(el, depth))
            .flat()
        ];
    }
};

const transformItems = (items) => {
    const root = createTrees();

    let flattenList = root
        .sort(function (a, b) {
            return a.seqId - b.seqId;
        })
        .reduce((newItems, element) => {
            const flattenList = flatTree(element, 0);
            return [...newItems, flattenList];
        }, [])
        .flat()
        .map((x) => delete x.children && x);

    return flattenList;
};

console.log(transformItems(items))