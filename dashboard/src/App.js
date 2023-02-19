import { io } from 'socket.io-client'
import { useEffect, useState, useMemo } from 'react'
import StatsCard from './components/stats-card/StatsCard'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'






const App = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const socket = io('http://localhost:4000', { transports: ['websocket'] })
    socket.on('stats', (data) => {
      console.log(data);
      setStats(data)
    })

    return () => {
      socket.close()
    }
  }, [])



  return (
    <div className="App">

      <div className="container">

        <div className="inner-container">
          <div className="top-cards">

            <StatsCard title='Orders' value={stats ? stats.ordersCount : ''} />


            <div className="space"></div>


            <StatsCard title='Orders In Progress' value={stats ? stats.ordersInProgressCount : ''} />



            <div className="space"></div>

            <StatsCard title='Open Stores' value={stats ? stats.opendStoresCount : ''} />



            <div className="space"></div>

            <StatsCard title='Process Avg' value={stats ? stats.processAvg : ''} />




          </div>

          <div className="space"></div>

          <div className="leadboards">

            <h1>Additions</h1>
            <div className="chart">
              {stats &&
                <Bar
                  data={{
                    labels: stats.topAdditions.map(data => data.key),
                    datasets: [
                      {
                        label: 'My First dataset',
                        borderWidth: 1,
                        data: stats.topAdditions.map(data => data.value)
                        // backgroundColor: 'rgba(255,99,132,0.2)',
                        // borderColor: 'rgba(255,99,132,1)',
                        // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        // hoverBorderColor: 'rgba(255,99,132,1)',
                      }
                    ]
                  }}

                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true,
                          min: 0,
                          max: 19,
                          stepSize: 3
                        }
                      }]
                    }
                  }}
                />
              }
            </div>



            {
              stats &&
              <Line
                data={{
                  labels: stats.orderByHour.map(data => data.key),
                  datasets: [
                    {
                      label: 'My First dataset',
                      borderWidth: 1,
                      data: stats.orderByHour.map(data => data.value)
                      // backgroundColor: 'rgba(255,99,132,0.2)',
                      // borderColor: 'rgba(255,99,132,1)',
                      // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                      // hoverBorderColor: 'rgba(255,99,132,1)',
                    }
                  ]
                }}

              />
            }


            <div className="space"></div>

            <div className="chart">
              {
                stats &&
                <Pie
                  options={{ maintainAspectRatio: false }}
                  width={200}
                  height={200}
                  data={{
                    labels: stats.distribution.map(data => data.key),
                    datasets: [
                      {
                        label: 'My First dataset',
                        borderWidth: 1,
                        data: stats.distribution.map(data => data.value)
                        // backgroundColor: 'rgba(255,99,132,0.2)',
                        // borderColor: 'rgba(255,99,132,1)',
                        // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        // hoverBorderColor: 'rgba(255,99,132,1)',
                      }
                    ]
                  }}

                />
              }
            </div>


            <div className="space"></div>



            {stats &&
              <Bar
                data={{
                  labels: stats.topProcessTimes.map(data => data.key),
                  datasets: [
                    {
                      label: 'My First dataset',
                      borderWidth: 1,
                      data: stats.topProcessTimes.map(data => data.value)
                      // backgroundColor: 'rgba(255,99,132,0.2)',
                      // borderColor: 'rgba(255,99,132,1)',
                      // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                      // hoverBorderColor: 'rgba(255,99,132,1)',
                    }
                  ]
                }}

                options={{
                  indexAxis: 'y',
                  elements: {
                    bar: {
                      borderWidth: 2,
                    },
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Process Time Leadboard',
                    },
                  }
                }}
              />
            }


          </div>
        </div>
      </div>







    </div>
  );
}

export default App;
