const db = require('../config/db');

// Get all majors
exports.getMajors = async (req, res) => {
  try {
    const [majors] = await db.execute(
      'SELECT major_id, major_name, description FROM Majors'
    );
    res.json(majors);
  } catch (error) {
    console.error('Get majors error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách chuyên ngành' });
  }
};

// Add new major
exports.addMajor = async (req, res) => {
  try {
    const { major_name, description } = req.body;

    const [result] = await db.execute(
      'INSERT INTO Majors (major_name, description) VALUES (?, ?)',
      [major_name, description]
    );

    res.status(201).json({
      message: 'Thêm chuyên ngành thành công',
      major: {
        major_id: result.insertId,
        major_name,
        description
      }
    });
  } catch (error) {
    console.error('Add major error:', error);
    res.status(500).json({ message: 'Lỗi khi thêm chuyên ngành' });
  }
};

// Update major
exports.updateMajor = async (req, res) => {
  try {
    const { major_id } = req.params;
    const { major_name, description } = req.body;

    await db.execute(
      'UPDATE Majors SET major_name = ?, description = ? WHERE major_id = ?',
      [major_name, description, major_id]
    );

    res.json({ message: 'Cập nhật chuyên ngành thành công' });
  } catch (error) {
    console.error('Update major error:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật chuyên ngành' });
  }
};

// Delete major
exports.deleteMajor = async (req, res) => {
  try {
    const { major_id } = req.params;
    await db.execute('DELETE FROM Majors WHERE major_id = ?', [major_id]);
    res.json({ message: 'Xóa chuyên ngành thành công' });
  } catch (error) {
    console.error('Delete major error:', error);
    res.status(500).json({ message: 'Lỗi khi xóa chuyên ngành' });
  }
}; 