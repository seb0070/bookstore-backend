const { Order, OrderItem, Book, sequelize } = require('../models');

exports.createOrder = async (userId, items) => {
    if (!items || items.length === 0) {
        const err = new Error('ORDER_ITEMS_EMPTY');
        err.status = 400;
        throw err;
    }

    return await sequelize.transaction(async (t) => {
        let totalPrice = 0;

        // 1️⃣ 주문 생성
        const order = await Order.create(
            {
                user_id: userId,
                status: 'PENDING',
                total_price: 0, // 임시
            },
            { transaction: t }
        );

        // 2️⃣ 아이템 처리
        for (const item of items) {
            const book = await Book.findByPk(item.bookId, {
                transaction: t,
            });

            if (!book) {
                const err = new Error('BOOK_NOT_FOUND');
                err.status = 404;
                throw err;
            }

            const itemPrice = Number(book.price) * item.quantity;
            totalPrice += itemPrice;

            await OrderItem.create(
                {
                    order_id: order.id,
                    book_id: book.id,
                    quantity: item.quantity,
                    price: book.price,
                },
                { transaction: t }
            );
        }

        // 3️⃣ 총액 업데이트
        order.total_price = totalPrice;
        await order.save({ transaction: t });

        return order;
    });
};
