const express = require('express');
const Task = require('../models/Task');  // Task modelini import ediyoruz
const router = express.Router();

// Görev oluşturma
router.post('/create', async (req, res) => {
  const { title } = req.body;

  try {
    const newTask = new Task({ title });  // Task modelini kullanarak yeni görev oluşturuyoruz
    await newTask.save();  // Veritabanına kaydediyoruz
    res.status(201).json({ message: 'Görev oluşturuldu!', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Görev oluşturulamadı!', error });
  }
});

// Görev listeleme
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();  // Task modelini kullanarak tüm görevleri alıyoruz
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Görevler alınamadı!', error });
  }
});

// Görev güncelleme
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, isCompleted } = req.body;

  try {
    const task = await Task.findById(id); // Görevi buluyoruz
    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı!' });
    }

    if (title !== undefined) task.title = title;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;

    await task.save();  // Güncellenmiş görevi kaydediyoruz
    res.json({ message: 'Görev güncellendi!', task });
  } catch (error) {
    res.status(500).json({ message: 'Görev güncellenemedi!', error });
  }
});

// Görev silme
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Silinecek ID:', id);  // Burada gelen id'yi konsola yazdırıyoruz
  
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'Geçersiz ID gönderildi!' });
    }
  
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).json({ message: 'Görev bulunamadı!' });
      }
      res.json({ message: 'Görev silindi!' });
    } catch (error) {
      res.status(500).json({ message: 'Görev silinemedi!', error });
    }
  });
  

// Tüm görevleri silme
router.delete('/delete-all', async (req, res) => {
  try {
    await Task.deleteMany();  // Tüm görevleri MongoDB'den siliyoruz
    res.json({ message: 'Tüm görevler silindi!' });
  } catch (error) {
    res.status(500).json({ message: 'Görevler silinemedi!', error });
  }
});

// Tüm görevleri tamamlanmış olarak işaretle
router.put('/mark-all-completed', async (req, res) => {
  try {
    await Task.updateMany({}, { $set: { isCompleted: true } });  // Tüm görevleri tamamlanmış olarak işaretliyoruz
    res.json({ message: 'Tüm görevler tamamlandı olarak işaretlendi!' });
  } catch (error) {
    res.status(500).json({ message: 'Görevler güncellenemedi!', error });
  }
});


module.exports = router;
