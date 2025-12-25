'use strict';

module.exports = {
    async up(queryInterface) {
        const wishlists = [];
        const orders = [];
        const orderItems = [];
        const carts = [];
        const cartItems = [];

        // 1. Wishlists - 30개
        for (let i = 0; i < 30; i++) {
            const userId = (i % 29) + 2;
            const bookId = (i * 3) % 100 + 1;

            wishlists.push({
                user_id: userId,
                book_id: bookId,
                created_at: new Date(),
            });
        }

        // 2. Orders - 20개
        for (let i = 0; i < 20; i++) {
            const userId = (i % 29) + 2;
            const statuses = ['PENDING', 'PAID', 'CANCELLED'];
            const status = statuses[i % 3];

            orders.push({
                user_id: userId,
                total_price: (i + 1) * 15000,
                status: status,
                created_at: new Date(Date.now() - (i * 3600000 * 24)), // i일 전
                updated_at: new Date(Date.now() - (i * 3600000 * 24)),
            });
        }

        // OrderItems 추가 후 재계산 (아래에서)

        // 3. Carts - 20개
        for (let i = 2; i <= 21; i++) { // user2~user21
            carts.push({
                user_id: i,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        // 먼저 삽입
        await queryInterface.bulkInsert('wishlists', wishlists);
        await queryInterface.bulkInsert('orders', orders);
        await queryInterface.bulkInsert('carts', carts);

        // 4. OrderItems - 각 주문당 2-4개
        for (let orderId = 1; orderId <= 20; orderId++) {
            const itemCount = 2 + (orderId % 3);

            for (let j = 0; j < itemCount; j++) {
                const bookId = ((orderId * 5 + j) % 100) + 1;
                const quantity = 1 + (j % 3);
                const price = 10000 + (orderId * 1000);

                orderItems.push({
                    order_id: orderId,
                    book_id: bookId,
                    quantity: quantity,
                    price: price,
                    created_at: new Date(),
                });
            }
        }

        // 5. CartItems - 각 카트당 1-3개
        for (let cartId = 1; cartId <= 20; cartId++) {
            const itemCount = 1 + (cartId % 3);

            for (let j = 0; j < itemCount; j++) {
                const bookId = ((cartId * 4 + j) % 100) + 1;
                const quantity = 1 + (j % 2);

                cartItems.push({
                    cart_id: cartId,
                    book_id: bookId,
                    quantity: quantity,
                    created_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert('order_items', orderItems);
        await queryInterface.bulkInsert('cart_items', cartItems);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('cart_items', null, {});
        await queryInterface.bulkDelete('order_items', null, {});
        await queryInterface.bulkDelete('carts', null, {});
        await queryInterface.bulkDelete('orders', null, {});
        await queryInterface.bulkDelete('wishlists', null, {});
    },
};
