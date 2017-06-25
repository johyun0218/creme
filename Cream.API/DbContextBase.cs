using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace Creme.API
{
    public class DbContextBase : DbContext
    {
        public DbContextBase(string name) : base(name)
        {
        }

        public async Task<List<T>> SqlQueryList<T>(string sql, params object[] parameters)
        {
            List<T> Rows = new List<T>();
            using (SqlConnection con = new SqlConnection(this.Database.Connection.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(sql, con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    foreach (var param in parameters)
                        cmd.Parameters.Add(param);
                    con.Open();
                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        if (dr.HasRows)
                        {
                            var dictionary = typeof(T).GetProperties().ToDictionary(field => CamelCaseToUnderscore(field.Name), field => field.Name);
                            while (dr.Read())
                            {
                                T tempObj = (T)Activator.CreateInstance(typeof(T));
                                foreach (var key in dictionary.Keys)
                                {
                                    PropertyInfo propertyInfo = tempObj.GetType().GetProperty(dictionary[key], BindingFlags.Public | BindingFlags.Instance);
                                    if (null != propertyInfo && propertyInfo.CanWrite)
                                        propertyInfo.SetValue(tempObj, Convert.ChangeType(dr[key], propertyInfo.PropertyType), null);
                                }
                                Rows.Add(tempObj);
                            }
                        }
                        dr.Close();
                    }
                }
            }
            return Rows;
        }

        private static string CamelCaseToUnderscore(string str)
        {
            return Regex.Replace(str, @"(?<!_)([A-Z])", "_$1").TrimStart('_').ToLower();
        }

    }
}