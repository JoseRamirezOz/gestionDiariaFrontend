angular.module("MyFirstApp", [])
    .controller("SecondController", ["$scope", "$http", function($scope, $http){
        $scope.tareasSemana = [];
        $scope.fechaInicio = "";
        $scope.fechaFin = "";
        $scope.fechasDiaSemana = [];
        $scope.numeroTareasPendientes = 0;

        $scope.diasDeLaSemana = [
            "Lunes",
            "Martes",
            "Miercoles",
            "Jueves",
            "Viernes",
            "Sabado",
            "Domingo"
        ]

        $scope.crearEditarTarea = {
            id:0,
            descEstudie: "",
            diaSemana: {
                id: 0,
                descripcion: ""
            },
            fecha: "",
            cumplimiento: 0
        }

        $scope.listTareasPendientes = []


        $scope.consultarSemanaActual = function(){
            $http.get("http://localhost:8080/obtener-semana-actual")
            .success(function(data){
                console.log(data)
                $scope.tareasSemana = data        
                $scope.tareasSemana.forEach(e =>$scope.fechasDiaSemana.push(e.fecha))
                $scope.fechasDiaSemana.forEach((e,i) =>{
                    if(i == 0) $scope.fechaInicio = $scope.fechasDiaSemana[i]
                    if(i == 6) $scope.fechaFin = $scope.fechasDiaSemana[i]
                })
                    
            }).error(function(err){
                console.error(err)
            });
        }

        $scope.consultarSemanaActual();


        $scope.obtenerTareasPendientes = function(){
            $http.get(`http://localhost:8080/obtener-tareas-pendientes/${convertirFecha(new Date())}`)
            .success(function(data){
                $scope.numeroTareasPendientes = data.length
                $scope.listTareasPendientes = data
                console.log($scope.listTareasPendientes)
            }).error(function(err){
                console.error(err)
            });
        }

        $scope.obtenerTareasPendientes();


        $scope.enviarEditarTarea = function (){
            $scope.crearEditarTarea.fecha.toLocaleDateString()
            $http.post("http://localhost:8080/crear-tarea",$scope.crearEditarTarea)
            .success(function(data,status,headers,config){
                $scope.crearEditarTarea =  {}
                $scope.consultarSemanaActual();
            }).error(function(err,status,headers,config){
                console.error(err)
            });
        }


        $scope.editarTarea = function(item){
            $scope.tareasSemana.forEach(e =>{
                if(e.id == item) {
                    // Resetear fecha para que no atrase dias
                    let fecha = new Date(e.fecha)
                    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
                    
                    console.log(e.fecha)
                    e.fecha = fecha  
                    $scope.crearEditarTarea = e
                }
            });

            $scope.listTareasPendientes.forEach(e =>{
                if(e.id == item) {
                    // Resetear fecha para que no atrase dias
                    let fecha = new Date(e.fecha)
                    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
                    
                    console.log(e.fecha)
                    e.fecha = fecha 
                    $scope.crearEditarTarea = e
                }
            });
        }

        $scope.limpiarTarea = () => $scope.crearEditarTarea = {}
      


        // UTILIDADES 
        function convertirFecha(fechaDeseada){
            let parsedDate = moment(fechaDeseada).format("YYYY-MM-DD");
            return parsedDate;
        }
    }]);