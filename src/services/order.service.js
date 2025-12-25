const { Order, OrderItem, Book, User, sequelize } = require('../models');

exports.createOrder = async (userId, items) => {
    if (!items || items.length === 0) {
        const error = new Error('주문 항목이 비어있습니다.');
        error.status = 400;
        error.code = 'ORDER_ITEMS_EMPTY';
        throw error;
    }

    return await sequelize.transaction(async (t) => {
        let totalPrice = 0;

        // 주문 생성
        const order = await Order.create(
            {
                user_id: userId,
                status: 'PENDING',
                total_price: 0 // 임시
            },
            { transaction: t }
        );

        // 주문 아이템 처리
        for (const item of items) {
            const book = await Book.findByPk(item.book_id, {
                transaction: t
            });

            if (!book || book.status === 'DELETED') {
                const error = new Error(`도서를 찾을 수 없습니다. (ID: ${item.book_id})`);
                error.status = 404;
                error.code = 'BOOK_NOT_FOUND';
                throw error;
            }

            // 재고 확인
            if (book.stock_quantity < item.quantity) {
                const error = new Error(`재고가 부족합니다. (도서: ${book.title})`);
                error.status = 422;
                error.code = 'INSUFFICIENT_STOCK';
                throw error;
            }

            const itemPrice = Number(book.price) * item.quantity;
            totalPrice += itemPrice;

            // 주문 아이템 생성
            await OrderItem.create(
                {
                    order_id: order.id,
                    book_id: book.id,
                    quantity: item.quantity,
                    price: book.price
                },
                { transaction: t }
            );

            // 재고 감소
            await book.update(
                { stock_quantity: book.stock_quantity - item.quantity },
                { transaction: t }
            );
        }

        // 총액 업데이트
        await order.update({ total_price: totalPrice }, { transaction: t });

        // 주문 항목 포함하여 반환
        const orderWithItems = await Order.findByPk(order.id, {
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'price']
                }]
            }],
            transaction: t
        });

        return orderWithItems;
    });
};

exports.getMyOrders = async (userId, query = {}) => {
    const page = parseInt(query.page) || 0;
    const size = parseInt(query.size) || 10;
    const offset = page * size;

    const { rows: orders, count } = await Order.findAndCountAll({
        where: { user_id: userId },
        include: [{
            model: OrderItem,
            as: 'items',
            include: [{
                model: Book,
                as: 'book',
                attributes: ['id', 'title', 'cover_image']
            }]
        }],
        limit: size,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        content: orders,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size)
    };
};

exports.getOrderById = async (orderId, userId) => {
    const order = await Order.findByPk(orderId, {
        include: [{
            model: OrderItem,
            as: 'items',
            include: [{
                model: Book,
                as: 'book'
            }]
        }, {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
        }]
    });

    if (!order) {
        const error = new Error('주문을 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'ORDER_NOT_FOUND';
        throw error;
    }

    // 본인 주문이 아니면 에러
    if (order.user_id !== userId) {
        const error = new Error('접근 권한이 없습니다.');
        error.status = 403;
        error.code = 'FORBIDDEN';
        throw error;
    }

    return order;
};

exports.updateOrderStatus = async (orderId, status) => {
    const order = await Order.findByPk(orderId);

    if (!order) {
        const error = new Error('주문을 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'ORDER_NOT_FOUND';
        throw error;
    }

    // 상태 전이 검증
    const validTransitions = {
        'PENDING': ['PAID', 'CANCELLED'],
        'PAID': ['CANCELLED'],
        'CANCELLED': []
    };

    if (!validTransitions[order.status]?.includes(status)) {
        const error = new Error(`주문 상태를 ${order.status}에서 ${status}로 변경할 수 없습니다.`);
        error.status = 400;
        error.code = 'INVALID_ORDER_STATUS';
        throw error;
    }

    await order.update({ status });

    // 취소 시 재고 복구
    if (status === 'CANCELLED') {
        const items = await OrderItem.findAll({
            where: { order_id: orderId }
        });

        for (const item of items) {
            const book = await Book.findByPk(item.book_id);
            if (book) {
                await book.update({
                    stock_quantity: book.stock_quantity + item.quantity
                });
            }
        }
    }

    return order;
};

// ADMIN
exports.getAllOrders = async (query = {}) => {
    const page = parseInt(query.page) || 0;
    const size = parseInt(query.size) || 10;
    const offset = page * size;

    const where = {};
    if (query.status) {
        where.status = query.status;
    }

    const { rows: orders, count } = await Order.findAndCountAll({
        where,
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
        }, {
            model: OrderItem,
            as: 'items',
            include: [{
                model: Book,
                as: 'book',
                attributes: ['id', 'title']
            }]
        }],
        limit: size,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        content: orders,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size)
    };
};