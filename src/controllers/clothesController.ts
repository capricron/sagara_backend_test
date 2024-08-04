import { Context } from 'hono';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllClothes = async (c: Context) => {
  try {
    const clothes = await prisma.clothes.findMany({
        orderBy: {
            id: 'asc'
        }
    })

    return c.json({
      message: 'Daftar semua baju berhasil diambil',
      data: clothes
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return c.json({
        message: 'Gagal mengambil daftar baju',
        error: error.message
      }, 500);
    }
    return c.json({
      message: 'Gagal mengambil daftar baju',
      error: 'Unknown error'
    }, 500);
  }
};

export const createClothes = async (c: Context) => {
  try {
    const { color, size, price, stock } = await c.req.json();
    const newClothes = await prisma.clothes.create({
      data: { color, size, price, stock },
    });
    return c.json({
      message: 'Baju berhasil ditambahkan',
      data: newClothes
    }, 201);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json({
        message: 'Gagal menambahkan baju',
        error: error.message
      }, 500);
    }
    return c.json({
      message: 'Gagal menambahkan baju',
      error: 'Unknown error'
    }, 500);
  }
};

export const searchClothes = async (c: Context) => {
  try {
    const { color, size } = c.req.query();
    const clothes = await prisma.clothes.findMany({
      where: { color, size },
    });

    // jika baju tidak ada
    if (clothes.length === 0) {
        return c.json({
            message: 'Baju tidak ditemukan',
            data: []
            }, 404);
    }

    return c.json({
      message: 'Pencarian baju berhasil',
      data: clothes
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json({
        message: 'Gagal mencari baju',
        error: error.message
      }, 500);
    }
    return c.json({
      message: 'Gagal mencari baju',
      error: 'Unknown error'
    }, 500);
  }
};

export const updatedClothes = async (c: Context) => {
    try {
      const { id } = c.req.param();
      const { color, size, price, stock } = await c.req.json();
      
      const updatedClothes = await prisma.clothes.update({
        where: { id: Number(id) },
        data: { color, size, price, stock },
      });
  
      return c.json({
        message: 'Data baju berhasil diperbarui',
        data: updatedClothes
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return c.json({
          message: 'Gagal memperbarui data baju',
          error: error.message
        }, 500);
      }
      return c.json({
        message: 'Gagal memperbarui data baju',
        error: 'Unknown error'
      }, 500);
    }
  };
export const addStock = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { amount } = await c.req.json();
    const clothes = await prisma.clothes.update({
      where: { id: Number(id) },
      data: { stock: { increment: amount } },
    });
    return c.json({
      message: 'Stok baju berhasil ditambahkan',
      data: clothes
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json({
        message: 'Gagal menambahkan stok baju',
        error: error.message
      }, 500);
    }
    return c.json({
      message: 'Gagal menambahkan stok baju',
      error: 'Unknown error'
    }, 500);
  }
};

export const reduceStock = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { amount } = await c.req.json();
    const clothes = await prisma.clothes.findUnique({
      where: { id: Number(id) },
    });
    if (!clothes) {
      return c.json({
        message: 'Baju tidak ditemukan',
      }, 404);
    }
    if (clothes.stock < amount) {
      return c.json({
        message: 'Stok tidak mencukupi untuk pengurangan',
      }, 400);
    }
    const updatedClothes = await prisma.clothes.update({
      where: { id: Number(id) },
      data: { stock: { decrement: amount } },
    });
    return c.json({
      message: 'Stok baju berhasil dikurangi',
      data: updatedClothes
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json({
        message: 'Gagal mengurangi stok baju',
        error: error.message
      }, 500);
    }
    return c.json({
      message: 'Gagal mengurangi stok baju',
      error: 'Unknown error'
    }, 500);
  }
};

export const getOutOfStockClothes = async (c: Context) => {
  try {
    const clothes = await prisma.clothes.findMany({
      where: { stock: 0 },
    });
    return c.json({
      message: 'Daftar baju yang habis stok berhasil diambil',
      data: clothes
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json({
        message: 'Gagal mengambil daftar baju yang habis stok',
        error: error.message
      }, 500);
    }
    return c.json({
      message: 'Gagal mengambil daftar baju yang habis stok',
      error: 'Unknown error'
    }, 500);
  }
};

export const getLowStockClothes = async (c: Context) => {
  try {
    const clothes = await prisma.clothes.findMany({
      where: { stock: { lt: 5 } },
    });
    return c.json({
      message: 'Daftar baju dengan stok kurang dari 5 berhasil diambil',
      data: clothes
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json({
        message: 'Gagal mengambil daftar baju dengan stok kurang dari 5',
        error: error.message
      }, 500);
    }
    return c.json({
      message: 'Gagal mengambil daftar baju dengan stok kurang dari 5',
      error: 'Unknown error'
    }, 500);
  }
};

export const deleteClothes = async (c: Context) => {
    try {
      const { id } = c.req.param();
  
      const clothes = await prisma.clothes.findUnique({
        where: { id: Number(id) },
      });
  
      if (!clothes) {
        return c.json({
          message: 'Baju tidak ditemukan',
        }, 404);
      }
  
      await prisma.clothes.delete({
        where: { id: Number(id) },
      });
  
      return c.json({
        message: 'Baju berhasil dihapus',
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return c.json({
          message: 'Gagal menghapus baju',
          error: error.message
        }, 500);
      }
      return c.json({
        message: 'Gagal menghapus baju',
        error: 'Unknown error'
      }, 500);
    }
};