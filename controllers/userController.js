const sql = require('../utils/db');
const AppError = require('../utils/appError');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await sql`SELECT id, name, email, role, isactive, created_at FROM users`;
        res.status(200).json({ 
            status: 'success', 
            results: users.length, 
            data: { users } 
        });
    } catch (err) { 
        next(err); 
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const [user] = await sql`SELECT id, name, email, role, isactive, created_at FROM users WHERE id = ${req.params.id}`;
        if (!user) {
            return next(new AppError(404, 'fail', 'User not found'));
        }
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) { 
        next(err); 
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, role, isactive } = req.body;
        
        // Validate input
        if (!name && !email && role === undefined && isactive === undefined) {
            return next(new AppError(400, 'fail', 'Please provide fields to update'));
        }

        // Build dynamic update query
        let updateFields = [];
        let values = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updateFields.push(`name = $${paramIndex}`);
            values.push(name);
            paramIndex++;
        }
        if (email !== undefined) {
            updateFields.push(`email = $${paramIndex}`);
            values.push(email);
            paramIndex++;
        }
        if (role !== undefined) {
            updateFields.push(`role = $${paramIndex}`);
            values.push(role);
            paramIndex++;
        }
        if (isactive !== undefined) {
            updateFields.push(`isactive = $${paramIndex}`);
            values.push(isactive);
            paramIndex++;
        }

        values.push(req.params.id);

        const query = `
            UPDATE users 
            SET ${updateFields.join(', ')} 
            WHERE id = $${paramIndex} 
            RETURNING id, name, email, role, isactive, created_at
        `;

        const result = await sql.unsafe(query, values);
        
        if (result.length === 0) {
            return next(new AppError(404, 'fail', 'User not found'));
        }

        res.status(200).json({ 
            status: 'success', 
            data: { user: result[0] } 
        });
    } catch (err) { 
        next(err); 
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const [deletedUser] = await sql`DELETE FROM users WHERE id = ${req.params.id} RETURNING id`;
        
        if (!deletedUser) {
            return next(new AppError(404, 'fail', 'User not found'));
        }
        
        res.status(204).json({ status: 'success', data: null });
    } catch (err) { 
        next(err); 
    }
};