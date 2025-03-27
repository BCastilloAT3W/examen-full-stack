# Ejercicio 1

## Enunciado

Esta página muestra nombres de empresas. Cada vez que clicamos en _Fetch more_ se añade un nombre más a la lista de empresas.

**Pero hay un problema**: el _endpoint_ que se utiliza para obtener los nombres de las empresas es muy lento, por lo que si clicamos muy rápido en _Fetch more_ la página puede acabar
mostrándo una lista con menos empresas de las que realmente se han solicitado.

![Example of the application showing a list of company names and a Fetch more button](./.github/images/screenshot.png)

Tu tarea es modificar el código de la página para que, si el usuario clicase en _Fetch more_ mientras la página está esperando a que la API responda, la petición anterior se cancele y se muestren los nombres de las empresas que se han solicitado en la última petición. También, mientras se espera a que la API responda, el botón _Fetch more_ debe cambiar a _Cancel_. Si clicas en _Cancel_ la petición se cancela.

## Notas

No debes modificar el código del endpoint que se utiliza para obtener los nombres de las empresas. Aunque tienes acceso a este código, puedes asumir que
este es un servicio externo del que no tienes control. La API de este servicio es la siguiente:

```
GET /api/get-companies?limit=N
```

Donde `N` es el número de empresas que se quieren obtener. La respuesta es un array de strings con los nombres de las empresas.
