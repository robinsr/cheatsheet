import MobxCategoryItem from 'store/app/CategoryItem.js';


const mock_data = {
    id: "1234",
    name: "Mock Category",
    items: [
        // todo
    ]
}

const mock = MobxCategoryItem.create(mock_data);

describe('CategoryItem', () => {
    describe('Actions', () => {
        test('addItem adds a new item', () => {
            mock.addItem();
            expect(mock.items).toHaveLength(1);
        });

        test('removeItem() removes an item', () => {
            expect(mock.items).toHaveLength(1);
            mock.removeItem(mock.items[0].id);
            expect(mock.items).toHaveLength(0);
        });
    });
});
