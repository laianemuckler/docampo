import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          axios.get('/auth/profile'),
          axios.get('/orders/my'),
        ]);
        setUser(profileRes.data);
        setOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error(
          'ProfilePage fetch error',
          err && err.response ? err.response.data : err,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="py-8 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          Carregando perfil...
        </div>
      </div>
    );
  if (!user)
    return (
      <div className="py-8 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          Usuário não autenticado
        </div>
      </div>
    );

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Perfil</h2>
              <div className="text-sm text-gray-400">{user.email}</div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Histórico de Compras</h3>

          {orders.length === 0 && (
            <div className="rounded-lg border p-6 shadow-sm border-gray-700 bg-gray-800">
              Nenhuma compra encontrada
            </div>
          )}

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div className="mt-1 text-lg font-medium">
                      Total: R${((order.totalAmount || 0) / 1).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    Itens: {order.products ? order.products.length : 0}
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {(order.products || []).map((p, idx) => {
                    const prod = p && p.product ? p.product : null;
                    const key = prod ? prod._id : `deleted-${idx}`;
                    return (
                      <li key={key} className="flex items-center gap-4 py-2">
                        {prod && prod.images && prod.images.length > 0 ? (
                          <img
                            src={prod.images[0]}
                            alt={prod.name || 'produto'}
                            className="w-14 h-14 object-cover rounded"
                          />
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">
                            {prod ? prod.name : 'Produto removido'}
                          </div>
                          <div className="text-sm text-gray-400">
                            Quantidade: {p.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-emerald-400">
                            R${(p.price || 0).toFixed(2)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
